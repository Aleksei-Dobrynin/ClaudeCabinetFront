import { runInAction, makeObservable, observable } from "mobx";
import i18n from "i18next";

import BaseStore from 'core/stores/BaseStore';
import MainStore from "MainStore";
import { deletePayer } from "api/Payer";
import { Payer } from "constants/Payer";
import { getPayersByCustomerId } from "api/Payer";
import { addPayerToApplication } from "api/ApplicationPayer";

class PayerListStore extends BaseStore {
  @observable data: Payer[] = [];
  @observable openPanel: boolean = false;
  @observable currentId: number = 0;
  @observable mainId: number = 0;
  @observable isEdit: boolean = false;


  constructor() {
    super();
    makeObservable(this);
  }


  setMainId = async (id: number) => {
    if (id !== this.mainId) {
      this.mainId = id;
      await this.loadPayers()
    }
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

  choosePayerClicked = async (payerId: number, applicationId: number, onSave: () => void) => {
    this.apiCall(
      () => addPayerToApplication(payerId, applicationId),
      (data) => {
        onSave()
      }
    );
  };
  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
  }

  loadPayers = async () => {
    if (this.mainId === 0) return;

    this.apiCall(
      () => getPayersByCustomerId(this.mainId),
      (data) => {
        if (Array.isArray(data)) {
          runInAction(() => {
            this.data = data;
          });
        }
      }
    );
  };

  deletePayer = (id: number) => {
    this.showConfirmDialog(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        this.apiCall(
          () => deletePayer(id),
          () => {
            this.loadPayers();
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

export default new PayerListStore();
