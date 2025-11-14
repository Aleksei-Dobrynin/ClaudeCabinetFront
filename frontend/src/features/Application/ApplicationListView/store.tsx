import { runInAction, makeObservable, observable } from "mobx";
import i18n from "i18next";

import BaseStore from 'core/stores/BaseStore';
import MainStore from "MainStore";
import { deleteApplication, getDocumentByGuid } from "api/Application";
import { Application } from "constants/Application";
import { getMyApplications } from "api/Application";
import { ApplicationStatus } from "constants/ApplicationStatus";
import { getApplicationStatuses } from "api/ApplicationStatus";

class ApplicationListStore extends BaseStore {
  @observable data: Application[] = [];
  @observable openPanel: boolean = false;
  @observable currentId: number = 0;
  @observable mainId: number = 0;
  @observable isEdit: boolean = false;

  @observable statusId: number = 0;
  @observable search: string = "";
  @observable statuses: ApplicationStatus[] = [];
  @observable filter: "all" | "need_action" | "accepted" | "done" | "draft" | "on_work" = "all"
  
  // Добавляем переменную для хранения ID интервала
  private refreshIntervalId: NodeJS.Timeout | null = null;

  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore(); // Call parent's clearStore first
    
    // Очищаем интервал при очистке store только если метод существует
    if (typeof this.stopAutoRefresh === 'function') {
      this.stopAutoRefresh();
    }
    
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.mainId = 0;
      this.isEdit = false;
      this.statusId = 0;
      this.search = "";
      this.filter = "all";
    });
  }

  onEditClicked(id: number) {
    runInAction(() => {
      this.openPanel = true;
      this.currentId = id;
    });
  }

  closePanel() {
    runInAction(() => {
      this.openPanel = false;
      this.currentId = 0;
    });
  }

  changeStatus(id: number) {
    this.statusId = id;
  }
  
  changeNumber(search: string) {
    this.search = search;
  }

  clearFilter() {
    this.statusId = 0
    this.search = ""
  }

  setFilter(filter: "all" | "need_action" | "accepted" | "done" | "draft" | "on_work") {
    this.filter = filter
  }

  doLoad() {
    this.loadApplications()
    this.loadApplicationStatuses()
  }

  // Улучшенный метод startAutoRefresh
  startAutoRefresh(interval = 10000) {
    // Сначала останавливаем существующий интервал, если он есть
    this.stopAutoRefresh();
    
    // Создаем новый интервал только если пользователь авторизован
    // Проверяем наличие текущего пользователя и компании
    if (MainStore.currentUser && MainStore.myCompany?.id) {
      this.refreshIntervalId = setInterval(() => {
        // Проверяем, что пользователь все еще авторизован перед обновлением
        if (MainStore.currentUser && MainStore.myCompany?.id) {
          this.refreshApplications();
        } else {
          // Если пользователь вышел из системы, останавливаем интервал
          this.stopAutoRefresh();
        }
      }, interval);
    }
  }

  // Новый метод для остановки авто-обновления
  stopAutoRefresh() {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    }
  }

  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
  }

  loadApplications = async () => {
    // Проверяем авторизацию перед загрузкой
    if (!MainStore.currentUser || !MainStore.myCompany?.id) {
      console.warn('Cannot load applications: user is not authenticated or company not selected');
      return;
    }

    this.apiCall(
      () => getMyApplications(this.statusId, this.search, this.filter, MainStore.myCompany?.id || 0),
      (data) => {
        if (Array.isArray(data)) {
          runInAction(() => {
            this.data = data;
          });
        }
      },
      (error) => {
        // Если ошибка 401 (не авторизован), останавливаем авто-обновление
        if (error?.response?.status === 401) {
          this.stopAutoRefresh();
        }
      }
    );
  };

  refreshApplications = async () => {
    // Проверяем авторизацию перед обновлением
    if (!MainStore.currentUser || !MainStore.myCompany?.id) {
      this.stopAutoRefresh();
      return;
    }

    try {
      const response = await getMyApplications(
        this.statusId, 
        this.search, 
        this.filter, 
        MainStore.myCompany?.id || 0
      );
      
      if ((response?.status === 200) && Array.isArray(response?.data)) {
        runInAction(() => {
          this.data.splice(0, this.data.length, ...response.data);
        });
      }
    } catch (error: any) {
      // Если ошибка 401 (не авторизован), останавливаем авто-обновление
      if (error?.response?.status === 401) {
        this.stopAutoRefresh();
      }
      console.error("Error refreshing applications:", error);
    }
  };

  loadApplicationStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationStatuses();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.statuses = [{ id: 0, name: "Все заявки" }, ...response.data]
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deleteApplication = (id: number) => {
    this.showConfirmDialog(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        this.apiCall(
          () => deleteApplication(id),
          () => {
            this.loadApplications();
            this.showSuccessSnackbar(i18n.t("message:snackbar.successDelete"));
          },
          (err) => {
            MainStore.openErrorDialog(i18n.t("message:error.documentIsAlreadyInUse"));
          }
        );
        MainStore.onCloseConfirm();
      }
    );
  };
}

export default new ApplicationListStore();