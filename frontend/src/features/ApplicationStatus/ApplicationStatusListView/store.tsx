import { runInAction, makeObservable, observable } from "mobx";
import i18n from "i18next";

import BaseStore from 'core/stores/BaseStore';
import MainStore from "MainStore";
import { deleteApplicationStatus } from "api/ApplicationStatus";
import { ApplicationStatus } from "constants/ApplicationStatus";
import { getApplicationStatuses } from "api/ApplicationStatus";

class ApplicationStatusListStore extends BaseStore {
  @observable data: ApplicationStatus[] = [];
  @observable openPanel: boolean = false;
  @observable currentId: number = 0;
  @observable mainId: number = 0;
  @observable isEdit: boolean = false;
  

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
  
  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
  }

  loadApplicationStatuss = async () => {
    
    this.apiCall(
      getApplicationStatuses,
      (data) => {
        if (Array.isArray(data)) {
          runInAction(() => {
            this.data = data;
          });
        }
      }
    );
  };

  deleteApplicationStatus = (id: number) => {
    this.showConfirmDialog(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        this.apiCall(
          () => deleteApplicationStatus(id),
          () => {
            this.loadApplicationStatuss();
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

export default new ApplicationStatusListStore();
