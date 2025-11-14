import { runInAction, makeObservable, observable } from "mobx";
import i18n from "i18next";
import BaseStore from 'core/stores/BaseStore';
import { getContactTypes, deleteContactType } from "api/ContactType";
import { ContactType } from "constants/ContactType";
import MainStore from "MainStore";

/**
 * Store for managing ContactType list data and operations
 */
class ContactTypeListStore extends BaseStore {
  @observable data: ContactType[] = [];
  @observable openPanel: boolean = false;
  @observable currentId: number = 0;

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Clear store state to initial values
   */
  clearStore() {
    super.clearStore(); // Call parent's clearStore first
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
    });
  }

  /**
   * Handle edit button click
   * @param id - ContactType ID to edit
   */
  onEditClicked(id: number) {
    runInAction(() => {
      this.openPanel = true;
      this.currentId = id;
    });
  }

  /**
   * Close the edit panel
   */
  closePanel() {
    runInAction(() => {
      this.openPanel = false;
      this.currentId = 0;
    });
  }

  /**
   * Load all ContactTypes from the API
   */
  loadContactTypes = async () => {
    this.apiCall(
      getContactTypes,
      (data) => {
        if (Array.isArray(data)) {
          runInAction(() => {
            this.data = data;
          });
        }
      }
    );
  };

  /**
   * Delete a ContactType by ID
   * @param id - ContactType ID to delete
   */
  deleteContactType = (id: number) => {
    this.showConfirmDialog(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        this.apiCall(
          () => deleteContactType(id),
          () => {
            this.loadContactTypes();
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

export default new ContactTypeListStore();