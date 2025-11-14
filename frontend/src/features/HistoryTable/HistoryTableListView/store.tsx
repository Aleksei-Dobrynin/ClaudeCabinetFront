import { runInAction, makeObservable, observable } from "mobx";
import i18n from "i18next";

import BaseStore from 'core/stores/BaseStore';
import MainStore from "MainStore";
import { deleteApplication } from "api/Application";
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
  @observable filter: string = ""


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore(); // Call parent's clearStore first
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.mainId = 0;
      this.isEdit = false;
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

  doLoad() {
    this.loadApplications()
    this.loadApplicationStatuses()
  }

  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
  }

  loadApplications = async () => {

    this.apiCall(
      () => getMyApplications(this.statusId, this.search, this.filter, MainStore.myCompany?.id || 0),
      (data) => {
        if (Array.isArray(data)) {
          runInAction(() => {
            this.data = data;
          });
        }
      }
    );
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
