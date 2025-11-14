// stores/ObjectStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import ApiService, { Service, ObjectTag } from "../services/ApiService";
import { RootStore } from "./RootStore";
import { getServices } from "api/Service";
import {
  findAddresses,
  getAllStreets,
  getAteChildren,
  getAteStreets, getDarek,
  getDistricts,
  getTags,
  getTundukDistricts, searchStreet
} from "api/ArchObject";
import { ArchObject, getRegularDistrictId } from "constants/ArchObject";
import { useRef } from "react";
import axios from "axios";
import { API_KEY_2GIS } from "../../../../constants/config";
import store from "../../Stepper/store";
import i18n from "i18next";
import MainStore from "MainStore";

export interface District {
  id: number;
  name: string;
  address_unit_id: number;
  code: string;
}

export class ObjectStore {
  rootStore: RootStore;

  // Service and work type
  selectedServiceId: number | null = null;
  selectedServiceName: string = "";
  workType: string = "";
  services: Service[] = [];
  isLoadingServices = false;
  archiveDocuments = [];
  TundukStreetsSearchCache = new Map(); // Кэш результатов поиска
  tundukStreetStates = new Map(); // Map для хранения состояний по индексу
  searchTimers = new Map(); // Таймеры для debounce
  currentApp = 0;
  newObjectId: number = -1;

  // Objects array
  objects: ArchObject[] = [
    {
      id: 0,
      districtId: 0,
      address: "",
      name: "",
      identifier: "",
      description: "",
      address_building: "",
      address_street: "",
      address_flat: "",
      applicationId: 0,
      tags: [],
      DarekSearchList: [],
      tunduk_district_id: 0,
      tunduk_residential_area_id: 0,
      tunduk_street_id: 0,
      tunduk_address_unit_id: 0,
      tunduk_building_id: 0,
      tunduk_building_num: "",
      tunduk_flat_num: "",
      open: false,
      is_manual: false,
      tunduk_uch_num: "",
    },
  ];

  // References
  districts: District[] = [];
  availableTags: ObjectTag[] = [];
  streetSuggestions: string[] = [];
  TundukDistricts = [];
  TundukResidentialAreas = [];
  TundukStreets = [];
  SearchResults = [];

  // Loading states
  isSearchingPin: Record<string, boolean> = {};
  isLoadingDistricts = false;
  isLoadingTags = false;

  // Errors
  searchErrors: Record<string, string> = {};
  errors: Record<string, any> = {};

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.loadInitialData();
  }

  generateTempId(): string {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getFullAddress() {
    return "";
  }

  async loadInitialData() {
    await Promise.all([this.loadServices(), this.loadDistricts(), this.loadTags(), this.loadTundukDistricts()]);
  }

  async reloadDependentData() {
    try {
      for (let i = 0; i < this.objects?.length || 0; i++) {
        const object = this.objects[i];
        if (object.tunduk_district_id) {
          await this.loadAteChildrens(object.tunduk_district_id);
        }
        if (object.tunduk_address_unit_id) {
          await this.loadStreets(object.tunduk_address_unit_id);
        }
        if (object.tunduk_street_id && (object.tunduk_building_num || object.tunduk_flat_num || object.tunduk_uch_num)) {
          await this.getTundukStreetState(i)
        }
      }
      setTimeout(() => {
        const saved = localStorage.getItem("objects");
        const parsed = JSON.parse(saved);
        if (parsed && this.currentApp == 0) {
          this.objects = parsed;
        }
      }, 1000);
    } catch (error) {
      this.rootStore.showSnackbar(i18n.t("object.error.loadingDependentData"), "error");
    }
  }

  initTundukStreetState = (index) => {
    if (!this.tundukStreetStates.has(index)) {
      this.tundukStreetStates.set(index, {
        inputValue: '',
        selectedStreet: null,
        isOpen: false,
        searchResults: [],
        isLoading: false
      });
    }
    return this.tundukStreetStates.get(index);
  };

  getTundukStreetState = (index) => {
    return this.tundukStreetStates.get(index) || this.initTundukStreetState(index);
  };

  handleTundukStreetChangeWithDistrictUpdate = async (index, newValue) => {
    const state = this.getTundukStreetState(index);
    var current_id = this.objects[index].id;
    if (typeof newValue === 'object' && newValue?.id) {
      runInAction(() => {
        state.selectedStreet = newValue;
      });

      this.updateObject(current_id!, 'tunduk_street_id', newValue?.street_id ?? 0);

      // Автоматически устанавливаем район и микрорайон на основе выбранной улицы
      if (newValue && newValue.address_unit_id) {
        try {
          // Сначала пытаемся найти микрорайон
          const residentialArea = this.TundukResidentialAreas.find(x => x.id == newValue.address_unit_id);

          if (residentialArea) {
            // Если это микрорайон, устанавливаем его
            this.updateObject(current_id!, 'tunduk_address_unit_id', residentialArea?.id);

            // Также устанавливаем родительский район для микрорайона
            if (residentialArea.parent_id) {
              this.updateObject(current_id!, 'tunduk_district_id', residentialArea?.parent_id);

              // АВТОМАТИЧЕСКИ УСТАНАВЛИВАЕМ ОБЫЧНЫЙ РАЙОН
              this.updateObject(current_id!, 'district_id', getRegularDistrictId(residentialArea.parent_id));
            }
          } else {
            // Если не микрорайон, проверяем, может это район
            const district = this.TundukDistricts.find(x => x.id == newValue.address_unit_id);

            if (district) {
              this.updateObject(current_id!, 'tunduk_district_id', district.id);

              // АВТОМАТИЧЕСКИ УСТАНАВЛИВАЕМ ОБЫЧНЫЙ РАЙОН
              this.updateObject(current_id!, 'district_id', getRegularDistrictId(district.id));

              // Загружаем микрорайоны для этого района
              await this.loadAteChildrens(district.id);

              // Сбрасываем микрорайон
              this.updateObject(current_id!, 'tunduk_address_unit_id', 0);
            }
          }
        } catch (error) {
          console.error('Ошибка при установке района для улицы:', error);
        }
      }
    } else {
      runInAction(() => {
        state.selectedStreet = null;
      });

      // Сбрасываем tunduk_street_id
      this.updateObject(current_id!, 'tunduk_street_id', 0);

      // Сбрасываем обычный район на "Не определено"
      this.updateObject(current_id!, 'district_id', this.districts.find(item => item.code === 'not defined')?.id || 6);
    }
  };

  // Обработчик изменения текста в поле ввода
  handleTundukStreetInputChange = (index, newInputValue, reason, objIndex) => {
    const state = this.getTundukStreetState(index);

    runInAction(() => {
      state.inputValue = newInputValue;
    });

    // Запускаем поиск только если пользователь вводит текст
    if (reason === 'input') {
      if (newInputValue.length >= 2) {
        this.debouncedSearchTundukStreets(index, newInputValue);
      } else {
        // Очищаем результаты если меньше 2 символов
        runInAction(() => {
          state.searchResults = [];
        });
      }
    }
  };

  // Debounced поиск для конкретного поля
  debouncedSearchTundukStreets = (index, searchQuery) => {
    // Очищаем предыдущий таймер для этого индекса
    if (this.searchTimers.has(index)) {
      clearTimeout(this.searchTimers.get(index));
    }

    // Если запрос короче 2 символов, очищаем результаты
    if (!searchQuery || searchQuery.trim().length < 2) {
      const state = this.getTundukStreetState(index);
      runInAction(() => {
        state.searchResults = [];
        state.isLoading = false;
      });
      return;
    }

    // Устанавливаем новый таймер
    const timer = setTimeout(() => {
      this.searchTundukStreets(index, searchQuery);
    }, 300);

    this.searchTimers.set(index, timer);
  };

  searchTundukStreets = async (index, searchQuery) => {
    const state = this.getTundukStreetState(index);

    // Игнорируем запросы короче 2 символов
    if (!searchQuery || searchQuery.trim().length < 2) {
      runInAction(() => {
        state.searchResults = [];
        state.isLoading = false;
      });
      return;
    }

    // Формируем ключ кэша с учетом района и микрорайона
    const districtId = this.objects[index]?.tunduk_district_id ?? 0;
    const addressUnitId = this.objects[index]?.tunduk_address_unit_id ?? 0;
    const cacheKey = `${searchQuery.toLowerCase().trim()}_${districtId}_${addressUnitId}`;

    // Проверяем кэш
    if (this.TundukStreetsSearchCache.has(cacheKey)) {
      runInAction(() => {
        state.searchResults = this.TundukStreetsSearchCache.get(cacheKey);
        state.isLoading = false;
      });
      return;
    }

    runInAction(() => {
      state.isLoading = true;
    });

    try {
      MainStore.changeLoader(true);

      // Определяем ID для фильтрации
      // Приоритет: микрорайон > район
      let filterAteId = 0;

      if (this.objects[index]?.tunduk_address_unit_id) {
        // Если выбран микрорайон, используем его
        filterAteId = this.objects[index].tunduk_address_unit_id;
      } else if (this.objects[index]?.tunduk_district_id) {
        // Если выбран только район, используем его
        filterAteId = this.objects[index].tunduk_district_id;
      }
      // Если ничего не выбрано (filterAteId = 0), API вернет все улицы

      const response = await searchStreet(searchQuery, filterAteId);

      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          // Фильтруем результаты на клиенте для дополнительной проверки
          let filteredResults = response.data;

          // Если выбран район или микрорайон, дополнительно фильтруем результаты
          if (filterAteId > 0) {
            filteredResults = response.data.filter(street => {
              // Проверяем, что улица принадлежит выбранному району/микрорайону
              return street.address_unit_id === filterAteId ||
                street.parent_address_unit_id === filterAteId;
            });
          }

          state.searchResults = filteredResults;
          state.isLoading = false;

          // Сохраняем в кэш
          this.TundukStreetsSearchCache.set(cacheKey, filteredResults);
        });
      } else {
        throw new Error();
      }

    } catch (error) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      runInAction(() => {
        state.searchResults = [];
        state.isLoading = false;
      });
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async loadServices() {
    this.isLoadingServices = true;
    try {
      const response = await getServices();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.services = response.data;
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      this.rootStore.showSnackbar(i18n.t("object.error.loadingServices"), "error");
    } finally {
      runInAction(() => {
        this.isLoadingServices = false;
      });
    }
  }

  async loadDistricts() {
    this.isLoadingDistricts = true;
    try {
      const response = await getDistricts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.districts = response.data;
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      this.rootStore.showSnackbar(i18n.t("object.error.loadingDistricts"), "error");
    } finally {
      runInAction(() => {
        this.isLoadingDistricts = false;
      });
    }
  }

  async loadTundukDistricts() {
    try {
      const response = await getTundukDistricts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.TundukDistricts = response.data;
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      this.rootStore.showSnackbar(i18n.t("object.error.loadingDistricts"), "error");
    }
  }

  async loadTags() {
    this.isLoadingTags = true;
    try {
      const response = await getTags();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.availableTags = response.data;
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      this.rootStore.showSnackbar(i18n.t("object.error.loadingTags"), "error");
    } finally {
      runInAction(() => {
        this.isLoadingTags = false;
      });
    }
  }

  setSelectedService(serviceId: number | null) {
    this.selectedServiceId = serviceId;
    this.selectedServiceName = this.services.find(x => x.id === serviceId)?.name
    if (this.errors.serviceId) {
      delete this.errors.serviceId;
    }
  }

  setWorkType(value: string) {
    this.workType = value;
    if (this.errors.workType) {
      delete this.errors.workType;
    }
  }

  addObject(newObjectId: number) {
    const newObject: ArchObject = {
      id: newObjectId,
      districtId: 0,
      address: "",
      name: "",
      identifier: "",
      address_building: "",
      address_street: "",
      address_flat: "",
      description: "",
      applicationId: 0,
      tags: [],
      DarekSearchList: [],
      tunduk_district_id: 0,
      tunduk_residential_area_id: 0,
      tunduk_street_id: 0,
      tunduk_address_unit_id: 0,
      tunduk_building_id: 0,
      tunduk_building_num: "",
      tunduk_flat_num: "",
      open: false,
      is_manual: false,
      tunduk_uch_num: "",
    };
    this.newObjectId = this.newObjectId -= 1;
    this.objects.push(newObject);
    this.rootStore.showSnackbar(i18n.t("object.success.objectAdded"), "success");
  }

  removeObject(objectId: number) {
    if (this.objects.length === 1) {
      this.rootStore.showSnackbar(i18n.t("object.validation.atLeastOneObject"), "warning");
      return;
    }

    const index = this.objects.findIndex((obj) => obj.id === objectId);
    if (index !== -1) {
      this.objects.splice(index, 1);
      // Clean up related data
      delete this.isSearchingPin[objectId];
      delete this.searchErrors[objectId];
      delete this.errors[objectId];
      this.rootStore.showSnackbar(i18n.t("object.success.objectRemoved"), "info");
    }
  }

  clearObject(objectId: number) {
    const object = this.objects.find((obj) => obj.id === objectId);
    if (object) {
      object.districtId = 0;
      object.address = "";
      object.name = "";
      object.identifier = "";
      object.description = "";
      object.address_building = "";
      object.address_street = "";
      object.address_flat = "";
      object.tags = [];
      object.xCoord = undefined;
      object.yCoord = undefined;
      object.DarekSearchList = [];
      object.tunduk_district_id = 0;
      object.tunduk_residential_area_id = 0;
      object.tunduk_street_id = 0;
      object.tunduk_building_id = 0;
      object.tunduk_building_num = "";
      object.tunduk_flat_num = "";
      object.open = false;
      object.tunduk_uch_num = "";

      delete this.isSearchingPin[objectId];
      delete this.searchErrors[objectId];
      delete this.errors[objectId];

      this.rootStore.showSnackbar(i18n.t("object.success.objectCleared"), "info");
    }
  }

  debounceTimeoutRef: NodeJS.Timeout | null = null;

  updateObject<K extends keyof ArchObject>(objectId: number, field: K, value: ArchObject[K]) {
    const object = this.objects.find((obj) => obj.id === objectId);
    if (object) {
      object[field] = value;

      if (field === 'address_street') {
        if (this.debounceTimeoutRef) {
          clearTimeout(this.debounceTimeoutRef);
        }
        this.debounceTimeoutRef = setTimeout(() => {
          this.searchBuildings(value as string);
        }, 500);
      }
      // Clear error for this field
      if (this.errors[objectId]?.[field]) {
        delete this.errors[objectId][field];
      }
      localStorage.setItem("objects", JSON.stringify(this.objects));
    }
  }

  handleTundukDistrictChange = (index, districtId) => {
    var current_id = this.objects[index].id;
    // Устанавливаем район Tunduk
    this.updateObject(current_id!, 'tunduk_district_id', districtId ?? 0)

    // АВТОМАТИЧЕСКИ УСТАНАВЛИВАЕМ ОБЫЧНЫЙ РАЙОН
    if (districtId) {
      this.updateObject(current_id!, 'district_id', getRegularDistrictId(districtId))
    } else {
      // Если район не выбран, ставим "Не определено"
      this.updateObject(current_id!, 'district_id', this.districts.find(item => item.code === 'not defined')?.id || 6)
    }
  };

  // Обработчик выбора значения
  handleTundukStreetChange = (index, newValue, objIndex) => {
    const state = this.getTundukStreetState(index);
    var current_id = this.objects[index].id;
    if (typeof newValue === 'object' && newValue?.id) {
      runInAction(() => {
        state.selectedStreet = newValue;
      });

      // Обновляем tunduk_street_id
      this.updateObject(current_id!, 'tunduk_street_id', newValue.id)

      // Обновляем район если есть улица
      if (newValue && newValue.address_unit_id) {
        const district = this.TundukDistricts.find(x => x.id == newValue.address_unit_id);
        if (district) {
          this.updateObject(current_id!, 'tunduk_district_id', district.id)
        }
      }
    } else {
      runInAction(() => {
        state.selectedStreet = null;
      });

      // Сбрасываем tunduk_street_id
      this.updateObject(current_id!, 'tunduk_street_id', 0)
    }
  };

  // Очистка состояния для индекса (при размонтировании компонента)
  clearTundukStreetState = (index) => {
    if (this.searchTimers.has(index)) {
      clearTimeout(this.searchTimers.get(index));
      this.searchTimers.delete(index);
    }
    this.tundukStreetStates.delete(index);
  };

  // Обработчик открытия dropdown
  handleTundukStreetOpen = (index) => {
    const state = this.getTundukStreetState(index);

    runInAction(() => {
      state.isOpen = true;
    });

    // Загружаем результаты при открытии, если есть текст
    if (state.inputValue && state.inputValue.length >= 2) {
      this.searchTundukStreets(index, state.inputValue);
    }
  };

  // Обработчик закрытия dropdown
  handleTundukStreetClose = (index) => {
    const state = this.getTundukStreetState(index);

    runInAction(() => {
      state.isOpen = false;
    });
  };

  searchResults: any[] = [];
  isListOpen = false;

  setSearchResults = (results: any[]) => {
    this.searchResults = results;
  };

  setIsListOpen = (val: boolean) => {
    this.isListOpen = val;
  };

  searchBuildings = async (query: string) => {
    if (!query) {
      this.setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get('https://catalog.api.2gis.com/3.0/items', {
        params: {
          q: query,
          point: '74.60,42.87',
          radius: 10000,
          key: API_KEY_2GIS,
          fields: 'items.point,items.address_name,items.adm_div',
        },
      });

      const results = response.data.result.items.filter(i => i.address_name != null) || [];
      this.setSearchResults(results);
      this.setIsListOpen(true);
    } catch (error) {
      console.error(i18n.t("object.error.searchError"), error);
    }
  };

  activeObjectId: number | null = null;

  setActiveObjectId(id: number | null) {
    this.activeObjectId = id;
  }

  handleItemClick = (objectId: number, result: any) => {
    this.setIsListOpen(false);

    const object = this.objects.find(obj => obj.id === objectId);
    if (!object) return;

    const districtName = result.adm_div?.find((d: any) => d.type === "district")?.name;
    const district = this.districts.find(d => d.name === districtName);
    const districtId = district?.id ?? null;

    object.districtId = Number(districtId);
    object.address_street = result.address_name?.split(',')[0]?.trim() ?? "";
    object.address_building = result.address_name?.split(',')[1]?.trim() ?? "";
    object.yCoord = result.point?.lon;
    object.xCoord = result.point?.lat;
  };

  updateObjectTags(objectId: number, tags: ObjectTag[]) {
    const object = this.objects.find((obj) => obj.id === objectId);
    if (object) {
      object.tags = tags.map((x) => x.id);
    }
  }

  validate(): boolean {
    const errors: Record<string, any> = {};

    // Validate service and work type
    if (!this.selectedServiceId) {
      errors.serviceId = i18n.t("object.validation.selectService");
    }

    if (!this.workType.trim()) {
      errors.workType = i18n.t("object.validation.enterWorkType");
    }

    // Validate each object
    this.objects.forEach((object, index) => {
      const objectErrors: Record<string, string> = {};

      if (Object.keys(objectErrors).length > 0) {
        errors[object.id!] = objectErrors;
      }
    });

    this.errors = errors;

    if (Object.keys(errors).length > 0) {
      // Show first error
      if (errors.serviceId) {
        this.rootStore.showSnackbar(errors.serviceId, "error");
      } else if (errors.workType) {
        this.rootStore.showSnackbar(errors.workType, "error");
      } else {
        this.rootStore.showSnackbar(i18n.t("object.validation.fillRequiredFields"), "error");
      }
    }

    return Object.keys(errors).length === 0;
  }

  getServiceName(): string {
    const service = this.services.find((s) => s.id === this.selectedServiceId);
    return service?.name || "";
  }

  getDistrictName(districtId: number): string {
    if(districtId === 0 || districtId === null) return i18n.t("object.address.notSpecified");
    if (!this.districts || this.districts.length === 0) return "";
    const district = this.districts.find((d) => d.id == districtId);
    return district?.name ;
  }

  getObjectAddress(object: ArchObject): string {
    const parts = [
      object.address_street,
      object.address_building && `д. ${object.address_building}`,
      object.address_flat && `кв. ${object.address_flat}`,
    ].filter(Boolean);

    return parts.join(", ");
  }

  reset() {
    this.selectedServiceId = null;
    this.workType = "";
    this.objects = [
      {
        id: 0,
        districtId: 0,
        address: "",
        name: "",
        identifier: "",
        description: "",
        applicationId: 0,
        address_building: "",
        address_street: "",
        address_flat: "",
        tags: [],
        DarekSearchList: [],
        tunduk_district_id: 0,
        tunduk_residential_area_id: 0,
        tunduk_street_id: 0,
        tunduk_address_unit_id: 0,
        tunduk_building_id: 0,
        tunduk_building_num: "",
        tunduk_flat_num: "",
        open: false,
        is_manual: false,
        tunduk_uch_num: "",
      },
    ];
    this.searchErrors = {};
    this.errors = {};
    this.isSearchingPin = {};
    this.streetSuggestions = [];
  }

  loadFromApplication(data: any) {
    if (data.rServiceId) this.selectedServiceId = data.rServiceId;
    if (data.rServiceName) this.selectedServiceName = data.rServiceName;
    if (data.workDescription) this.workType = data.workDescription;
    if (data.archObjects && data.archObjects.length > 0) {
      this.objects = data.archObjects.map((obj: ArchObject) => ({
        ...obj,
        id: obj.id || this.generateTempId(),
      }));
    }
    setTimeout(() => {
      this.reloadDependentData();
    }, 1000);
  }

  getFormData() {
    return {
      serviceId: this.selectedServiceId,
      workType: this.workType,
      objects: this.objects,
    };
  }

  loadAteChildrens = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getAteChildren(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.TundukResidentialAreas = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadStreets = async (id?: number) => {
    try {
      MainStore.changeLoader(true);
      const response = id && id > 0 ? await getAteStreets(id) : await getAllStreets();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.TundukStreets = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  findAddresses = async (i: number) => {
    try {
      const state = this.getTundukStreetState(i);
      if (!state?.selectedStreet?.street_id) {
        MainStore.setSnackbar("Выберите улицу", "error");
        return;
      }
      MainStore.changeLoader(true);
      // let selectedStreetId = this.TundukStreets.find(x => x.id == this.arch_objects[i].tunduk_street_id)?.streetId ?? 0;

      const response = await findAddresses(state?.selectedStreet?.street_id, this.objects[i].tunduk_building_num, this.objects[i].tunduk_flat_num, this.objects[i].tunduk_uch_num);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.SearchResults = response.data.list
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  searchFromDarek = async (eni: string, index: number) => {
    try {
      MainStore.changeLoader(true);
      if (eni.length >= 13) {
        eni = eni.substring(0, 15)
      } else {
        return
      }
      const response = await getDarek(eni);
      const object = this.objects.find((obj) => obj.id === index);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        object.address = response.data.address;
        object.identifier = response.data.propcode.toString() ?? '';
        object.geometry = JSON.parse(response.data.geometry);
        if (object.geometry.length > 0) {
          object.xCoord = object.geometry[0][0];
          object.yCoord = object.geometry[0][1];
        }
        object.addressInfo = response.data.info;
        object.address_street = response.data.address;
      } else if (response.status === 204) {
        object.address = '';
        object.identifier = '';
        object.geometry = [];
        object.addressInfo = [];
        MainStore.setSnackbar(i18n.t("message:snackbar.searchNotFound"), "error");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
}