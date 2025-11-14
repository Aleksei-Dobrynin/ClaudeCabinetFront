import { runInAction, makeObservable, observable } from "mobx";
import i18n from "i18next";

import BaseStore from 'core/stores/BaseStore';
import MainStore from "MainStore";
import { deleteRepresentative } from "api/Representative";
import { Representative } from "constants/Representative";
import { getRepresentativesByCompanyId } from "api/Representative";
import { registerRepresentative } from "api/Auth/useAuth";

class RepresentativeListStore extends BaseStore {
  @observable data: Representative[] = [];
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

  setMainId = async (id: number) => {
    if (id !== this.mainId) {
      this.mainId = id;
      await this.loadRepresentatives()
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

  sendInvite = async (id: number) => {
    if (id === 0) return;
    
    const repr = this.data.find(x => x.id === id);
    if(!repr) return;

    this.apiCall(
      () => registerRepresentative(repr.email, repr.companyId, repr.pin, repr.firstName, repr.lastName, repr.secondName),
      (data) => {
        this.loadRepresentatives()
      }
    );
  };

  loadRepresentatives = async () => {
    if (this.mainId === 0) return;
    
    this.apiCall(
      () => getRepresentativesByCompanyId(this.mainId),
      (data) => {
        if (Array.isArray(data)) {
          runInAction(() => {
            this.data = data;
          });
        }
      }
    );
  };

  deleteRepresentative = (id: number) => {
    this.showConfirmDialog(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        this.apiCall(
          () => deleteRepresentative(id),
          () => {
            this.loadRepresentatives();
            this.showSuccessSnackbar(i18n.t("message:snackbar.successDelete"));
          },
          (err) => {
            MainStore.openErrorDialog(i18n.t("message:error.businessLogicError"));
          }
        );
        MainStore.onCloseConfirm();
      }
    );
  };
}

export default new RepresentativeListStore();