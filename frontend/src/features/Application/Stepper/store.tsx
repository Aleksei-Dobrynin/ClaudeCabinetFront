import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { API_KEY_2GIS } from "constants/config";
import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getApplication, createApplication, updateApplication, setCustomerToApplication, sendToBga, getDogovorTemplate, validateCheckApplication } from "api/Application";
import { Application, ApplicationCreateModel } from "constants/Application";
import { downloadFile } from "api/MainBackAPI";
import { getArchObject, getArchObjects, getTags, getDistricts } from "api/ArchObject";

import { getApplicationStatuses } from "api/ApplicationStatus";

import { getCustomers } from "api/Customer";
import { getServices } from "api/Service";
import { ArchObject } from "constants/ArchObject";
import { getDarek, getSearchDarek } from "../../../api/SearchMap/useGetDarek";
import { number } from "yup";
import { getCountries } from "api/Country/GetCountries";
import { getUploadedApplicationDocumentsForApplication } from "api/UploadedApplicationDocument";

interface ApplicationResponse {
  id: number;
}

class ApplicationStore extends BaseStore {
  @observable id: number = 0
  @observable workDescription: string = ""
  @observable archObjectId: number = 0
  @observable statusId: number = 0
  @observable statusCode: string = ""
  @observable companyId: number = 0
  @observable rServiceId: number = 0
  @observable rServiceName: string = ""
  @observable uniqueCode: string = ""
  @observable registrationDate: Dayjs = null
  @observable deadline: Dayjs = null
  @observable number: string = ""
  @observable comment: string = ""
  @observable rejectHtml: string = ""
  @observable rejectFileId: number = 0
  @observable appCabinetUuid: string = ""

  @observable dogovorTemplate: string = ""

  @observable activeStep: number = 0
  @observable openPanelQrCode: boolean = false
  @observable openPanelArchObject: boolean = false

  @observable changed: boolean = false;
  @observable coordsEdited: boolean;
  @observable coordsInEditing: boolean = false;
  @observable object_xcoord: number;
  @observable object_ycoord: number;
  @observable newCoordAddres: null;
  @observable archObjects: ArchObject[] = []
  @observable editedArchObject = null
  @observable services = []
  @observable tags = []
  @observable districts = [];
  @observable applicationStatuses = []
  @observable geometry = null
  @observable point = null
  @observable yCoord = null
  @observable xCoord = null
  @observable allTags = []


  constructor() {
    super();
    makeObservable(this);
  }

  getRandomInt() {
    return Math.floor(Math.random() * 1000000);
  }

  navigateToStepWithUrl(step: number, navigate: (url: string) => void) {
    this.setActiveStep(step);
    if (this.id > 0) {
      navigate(`/user/stepper?id=${this.id}&tab=${step}`);
    }
  }

  setActiveStep(step: number, resetChanged: boolean = false) {
    runInAction(() => {
      this.activeStep = step;
      if (resetChanged) {
        this.resetChangedFlag();
      }
    });
  }

  onAddEditArchObject(flag: boolean, archObj?: ArchObject) {
    this.openPanelArchObject = flag
    if (flag) {
      this.editedArchObject = archObj
    } else {
      this.editedArchObject = null
    }
  }

  setArchObjectData(data: ArchObject) {
    if (data.id === 0) {
      data.id = this.getRandomInt() * -1
      this.archObjects = [...this.archObjects, data]
    } else {
      this.archObjects = this.archObjects.map(obj =>
        obj.id === data.id ? { ...obj, ...data } : obj
      )
    }
    this.changed = true;
  }

  // Method to reset the changed flag
  resetChangedFlag() {
    this.changed = false;
  }

  // Method to check if navigation should be allowed
  canNavigateToStep(targetStep: number): boolean {
    // Only allow navigation if application is created
    if (this.id <= 0) {
      return false;
    }

    // If there are unsaved changes, require confirmation (handled in UI)
    // Otherwise, allow navigation
    return true;
  }

  deleteAddress(i: number) {
    this.archObjects.splice(i, 1);
    this.changed = true;
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
      this.workDescription = ""
      this.archObjectId = 0
      this.statusId = 0
      this.statusCode = ""
      this.companyId = 0
      this.rServiceId = 0
      this.rServiceName = ""
      this.uniqueCode = ""
      this.registrationDate = null
      this.deadline = null
      this.number = ""
      this.comment = ""
      this.activeStep = 0
      this.openPanelArchObject = false
      this.archObjects = []
      this.editedArchObject = null
      this.services = []
      this.tags = []
      this.applicationStatuses = []
      this.changed = false;
      this.rejectHtml = '';
      this.rejectFileId = 0;
      this.appCabinetUuid = "";
    });
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  async sendToBga(navigate: (url: string) => void) {
    const validation = await this.validateApplicationBeforeSend();
    if (!validation.isValid) {
      MainStore.openErrorDialog(validation.message || "Заявка не прошла проверку");
      return;
    }

    this.apiCall(
      () => sendToBga(this.id, this.dogovorTemplate),
      () => {
        this.setActiveStep(10);
        MainStore.setSnackbar(i18n.t("Ваша заявка сохранена!"));
      }
    );
  }

  setQrCodePanel(flag: boolean) {
    this.openPanelQrCode = flag
  }

  handleChange(event: { target: { name: string; value: any; }; }): void {
    super.handleChange(event);
    this.changed = true;
    if (event.target.name === "rServiceId") {
      const serviceName = this.services.find(x => x.id === this.rServiceId)
      this.handleChange({ target: { value: serviceName?.name, name: "rServiceName" } })
    }
  }

  newAddressClicked() {
    this.archObjects = [...this.archObjects, {
      id: (this.archObjects.length + 1) * -1,
      districtId: 0,
      address: "",
      name: "",
      identifier: "",
      description: '',
      applicationId: 0,
      xCoord: null,
      yCoord: null,
      tags: [],
      geometry: [],
      addressInfo: [],
      point: [],
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
    }]
    this.changed = true;
  }

  searchFromDarek = async (eni: string, index: number) => {
    try {
      MainStore.changeLoader(true);
      if (eni.length >= 13) {
        eni = eni.substring(0, 15)
      } else {
        return
      }
      const response = await getDarek(eni);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        // this.address = response.data.address;
        // this.identifier = response.data.propcode.toString() ?? '';
        this.archObjects[index].geometry = JSON.parse(response.data.geometry);
        this.changed = true;
        if (this.archObjects[index].geometry.length > 0) {
          this.archObjects[index].xCoord = this.archObjects[index].geometry[0][0];
          this.archObjects[index].yCoord = this.archObjects[index].geometry[0][1];
        }
        this.archObjects[index].address = response.data.address;
        this.archObjects[index].addressInfo = response.data.info;
        this.geometry = this.archObjects[index].geometry
        // this.geometry = JSON.parse(response.data.geometry);
        // this.addressInfo = response.data.info;
      } else if (response.status === 204) {
        this.archObjects[index].address = '';
        this.archObjects[index].identifier = '';
        this.archObjects[index].geometry = [];
        this.archObjects[index].addressInfo = [];
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

  async handleChangeCoords(event, index: number) {
    this.archObjects[index][event.target.name] = event.target.value;
    this.changed = true;

    const xCoord = this.archObjects[index].xCoord;
    const yCoord = this.archObjects[index].yCoord;

    if (!isNaN(xCoord) && !isNaN(yCoord)) {
      try {
        const response = await axios.get('https://catalog.api.2gis.com/3.0/items/geocode', {
          params: {
            lat: xCoord,
            lon: yCoord,
            fields: "items.point,items.address_name",
            key: API_KEY_2GIS,
          },
        });

        const results = response.data.result.items || [];
        if (results?.length > 0) {
          this.archObjects[index].address = results[0].address_name || results[0].name || "";

          this.archObjects[index].point = [xCoord, yCoord];
        }
      } catch (error) {
        console.error('Ошибка поиска адреса:', error);
      }
    }
  }

  handleChangearchObjects(event, index: number) {
    this.archObjects[index][event.target.name] = event.target.value;
    this.changed = true;
  }

  getSearchListFromDarek = async (propcode: string, index: number) => {
    try {
      // var propcode = "1-02-03-0006-0003-01"
      const response = await getSearchDarek(propcode);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.archObjects[index].DarekSearchList = response.data;
        if (response.data?.length === 1) {
          this.handleChangearchObjects({ target: { value: [], name: "DarekSearchList" } }, index)
          this.searchFromDarek(response.data[0]?.propcode ?? "", index);
        }
        // this.address = response.data.address;
        // this.identifier = response.data.propcode.toString() ?? '';
        // this.geometry = JSON.parse(response.data.geometry);
        // this.addressInfo = response.data.info;
      } else if (response.status === 204) {
        // this.address = '';
        // this.identifier = '';
        // this.geometry = [];
        // this.addressInfo = [];
        MainStore.setSnackbar(i18n.t("message:snackbar.searchNotFound"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  };

  async checkRequiredDocuments(): Promise<boolean> {
    if (this.id === 0) return false;

    let requiredDocs = null
    await this.apiCall(
      () => getUploadedApplicationDocumentsForApplication(this.id),
      (data: any) => {
        requiredDocs = data.filter(x => x.is_required && x.file_id == null);
      }
    );
    if (requiredDocs == null) return false;
    if (requiredDocs.length > 0) return false;
    return true;
  }

  async onSaveClick(navigate: (url: string) => void) {
    if (this.id !== 0 && !this.changed) {
      const nextStep = this.activeStep + 1;
      this.setActiveStep(nextStep);
      navigate(`/user/stepper?id=${this.id}&tab=${nextStep}`);
      return;
    }

    const data: ApplicationCreateModel = {
      id: this.id - 0,
      workDescription: this.workDescription,
      archObjectId: this.archObjectId - 0 === 0 ? null : this.archObjectId - 0,
      statusId: this.statusId - 0,
      companyId: this.companyId - 0 === 0 ? null : this.companyId - 0,
      rServiceId: this.rServiceId - 0,
      rServiceName: this.rServiceName,
      uniqueCode: this.uniqueCode,
      registrationDate: this.registrationDate,
      deadline: this.deadline,
      number: this.number,
      comment: this.comment,
      archObjects: this.archObjects
    };

    data.archObjects.forEach(x => { x.applicationId = this.id })
    if (data.archObjects.length === 0) {
      return MainStore.openErrorDialog("Нужно добавить адрес!");
    }

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createApplication(data) :
      () => updateApplication(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: ApplicationResponse) => {
        if (data.id === 0) {
          runInAction(() => {
            this.id = response.id;
            this.changed = false;
          });
          this.showSuccessSnackbar(i18n.t("message:snackbar.successSave"));
        } else {
          runInAction(() => {
            this.changed = false;
          });
          this.showSuccessSnackbar(i18n.t("message:snackbar.successEdit"));
        }

        const nextStep = this.activeStep + 1;
        this.setActiveStep(nextStep);
        navigate(`/user/stepper?id=${this.id}&tab=${nextStep}`);
      }
    );
  };

  async saveCustomerId(customerId: number, navigate: (url: string) => void) {
    this.apiCall(
      () => setCustomerToApplication(this.id, customerId),
      () => {
        runInAction(() => {
          this.companyId = customerId;
        });

        const nextStep = this.activeStep + 1;
        this.setActiveStep(nextStep);
        navigate(`/user/stepper?id=${this.id}&tab=${nextStep}`);
      }
    );
  }

  async doLoad(id: number) {
    await this.loadApplicationStatuses();
    await this.loadServices();
    await this.loadtags();
    await this.loadDistricts();

    if (id) {
      this.id = id;
      await this.loadApplication(id);
    } else {
      this.archObjects = [
        {
          id: 0, name: "", address: '', districtId: 0,
          identifier: "", description: "", applicationId: this.id, DarekSearchList: []
        }
      ]
    }
  }

  loadApplication = async (id: number) => {
    this.apiCall(
      () => getApplication(id),
      (data: Application) => {
        runInAction(() => {
          this.id = data.id;
          this.workDescription = data.workDescription;
          this.archObjectId = data.archObjectId;
          this.statusId = data.statusId;
          this.statusCode = data.statusCode;
          this.companyId = data.companyId;
          this.rServiceId = data.rServiceId;
          this.rServiceName = data.rServiceName;
          this.uniqueCode = data.uniqueCode;
          this.registrationDate = dayjs(data.registrationDate);
          this.deadline = dayjs(data.deadline);
          this.number = data.number;
          this.comment = data.comment;
          this.archObjects = data.archObjects;
          this.rejectHtml = data.rejectHtml;
          this.rejectFileId = data.rejectFileId;
          this.appCabinetUuid = data.appCabinetUuid;
        });
        // this.loadArchObject(data.archObjectId)
      }
    );
  };

  updateActiveStepFromUrl(tabParam: string | null) {
    if (tabParam && !isNaN(Number(tabParam))) {
      this.setActiveStep(Number(tabParam));
    }
  }

  loadTemplateDogovor = async () => {
    if (this.id === 0) return;
    this.apiCall(
      () => getDogovorTemplate(this.id),
      (data: string) => {
        runInAction(() => {
          this.dogovorTemplate = data
        });
      }
    );
  };

  changeTags(ids: number[], index: number) {
    this.archObjects[index]["tags"] = ids;
    this.changed = true;
  }

  async setCoords(x: number, y: number) {
    this.coordsEdited = true;
    this.object_xcoord = x
    this.object_ycoord = y

    try {
      const response = await axios.get('https://catalog.api.2gis.com/3.0/items/geocode', {
        params: {
          lat: x,
          lon: y,
          fields: "items.point,items.address_name",
          key: API_KEY_2GIS,
        },
      });

      const results = response.data.result.items || [];
      if (results?.length !== 0) {
        this.newCoordAddres = results[0].name
        this.archObjects[this.archObjects.length - 1].address = results[0].name
      }
    } catch (error) {
      // console.error('Ошибка поиска:', error);
    }
  }

  loadApplicationStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationStatuses();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.applicationStatuses = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadServices = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getServices();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.services = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async validateApplicationBeforeSend(): Promise<{ isValid: boolean, message?: string }> {
    let validationResult = { isValid: true, message: "" };

    await this.apiCall(
      () => validateCheckApplication(this.id),
      () => {
        validationResult.isValid = true;
      },
      (error) => {
        validationResult = {
          isValid: false,
          message: error?.response?.data?.message || "Заявка не прошла валидацию"
        };
      }
    );

    return validationResult;
  }

  loadtags = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTags();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.tags = response.data
        this.allTags = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadDistricts = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDistricts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        let districts = response.data
        this.districts = districts
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async downloadFile(idFile: number, fileName) {
    try {
      MainStore.changeLoader(true);
      console.log('sdsd')
      const response = await downloadFile(idFile);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const byteCharacters = atob(response.data.file_contents);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const mimeType = response.data.contentType || 'application/octet-stream';
        const fileNameBack = response.data.file_download_name;
        let url = ""

        if (fileNameBack.endsWith('.jpg') || fileNameBack.endsWith('.jpeg') || fileNameBack.endsWith('.png')) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: mimeType });
            url = window.URL.createObjectURL(blob);
            newWindow.document.write(`<img src="${url}" />`);
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error('Не удалось открыть новое окно. Возможно, оно было заблокировано.');
          }
        } else if (fileNameBack.endsWith('.pdf')) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            url = window.URL.createObjectURL(blob);
            newWindow.location.href = url;
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error('Не удалось открыть новое окно. Возможно, оно было заблокировано.');
          }
        } else {
          const blob = new Blob([byteArray], { type: mimeType });
          url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', response.data.fileDownloadName || fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }


}

export default new ApplicationStore();