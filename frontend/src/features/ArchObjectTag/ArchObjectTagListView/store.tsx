import { runInAction, makeObservable, observable } from "mobx";
import i18n from "i18next";

import BaseStore from 'core/stores/BaseStore';
import MainStore from "MainStore";
import { deleteArchObjectTag } from "api/ArchObjectTag";
import { ArchObjectTag } from "constants/ArchObjectTag";
import { getArchObjectTagsByIdObject } from "api/ArchObjectTag";

class ArchObjectTagListStore extends BaseStore {
  @observable data: ArchObjectTag[] = [];
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
      await this.loadArchObjectTags()
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

  loadArchObjectTags = async () => {
    if (this.mainId === 0) return;
    
    this.apiCall(
      () => getArchObjectTagsByIdObject(this.mainId),
      (data) => {
        if (Array.isArray(data)) {
          runInAction(() => {
            this.data = data;
          });
        }
      }
    );
  };

  deleteArchObjectTag = (id: number) => {
    this.showConfirmDialog(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        this.apiCall(
          () => deleteArchObjectTag(id),
          () => {
            this.loadArchObjectTags();
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

export default new ArchObjectTagListStore();
