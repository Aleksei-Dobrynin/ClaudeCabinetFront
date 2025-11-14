import { runInAction, makeObservable, observable } from "mobx";
import i18n from "i18next";
import BaseStore from 'core/stores/BaseStore';
import { getServices, deleteService } from "api/Service";
import { Service } from "constants/Service";
import MainStore from "../../../MainStore";

/**
 * Store for managing Service list data and operations
 */
class ServiceListStore extends BaseStore {
  @observable data: Service[] = [];
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
   * @param id - Service ID to edit
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
   * Load all services from the API
   */
  loadServices = async () => {
    this.apiCall(
      getServices,
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
   * Delete a service by ID
   * @param id - Service ID to delete
   */
  deleteService = (id: number) => {
    this.showConfirmDialog(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        this.apiCall(
          () => deleteService(id),
          () => {
            this.loadServices();
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

export default new ServiceListStore();