import { runInAction, makeObservable, observable } from "mobx";
import i18n from "i18next";

import BaseStore from 'core/stores/BaseStore';
import MainStore from "MainStore";
import { deleteApplicationPayer } from "api/ApplicationPayer";
import { ApplicationPayer } from "constants/ApplicationPayer";
import { getApplicationPayersByApplicationId } from "api/ApplicationPayer";
import { getPayersByCustomerId } from "api/Payer";

class ApplicationPayerListStore extends BaseStore {
  @observable data: ApplicationPayer[] = [];
  @observable openPanel: boolean = false;
  @observable currentId: number = 0;
  @observable mainId: number = 0;
  @observable isEdit: boolean = false;
  @observable openPanelChooseOldPayer: boolean = false;


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

  changePanelChooseOldPayer = (flag: boolean) => {
    this.openPanelChooseOldPayer = flag
  }

  setMainId = async (id: number) => {
    if (id !== this.mainId) {
      this.mainId = id;
      await this.loadApplicationPayers()
    }
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

  loadApplicationPayers = async () => {
    if (this.mainId === 0) return;

    this.apiCall(
      () => getApplicationPayersByApplicationId(this.mainId),
      (data) => {
        if (Array.isArray(data)) {
          runInAction(() => {
            this.data = data;
          });
        }
      }
    );
  };

  deleteApplicationPayer = (id: number) => {
    this.showConfirmDialog(
      i18n.t("common:areYouSure"),
      i18n.t("common:delete"),
      i18n.t("common:no"),
      async () => {
        this.apiCall(
          () => deleteApplicationPayer(id),
          () => {
            this.loadApplicationPayers();
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

export default new ApplicationPayerListStore();