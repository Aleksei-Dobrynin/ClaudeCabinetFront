import { runInAction, makeObservable, observable } from "mobx";
import i18n from "i18next";

import BaseStore from 'core/stores/BaseStore';
import MainStore from "MainStore";
import { deleteApplicationPaidInvoice } from "api/ApplicationPaidInvoice";
import { ApplicationPaidInvoice } from "constants/ApplicationPaidInvoice";
import { getApplicationPaidInvoicesByApplicationId, getApplicationPaidInvoices, getApplicationPaidInvoicesByCustomerId } from "api/ApplicationPaidInvoice";

class ApplicationPaidInvoiceListStore extends BaseStore {
  @observable data: ApplicationPaidInvoice[] = [];
  @observable openPanel: boolean = false;
  @observable currentId: number = 0;
  @observable customerId: number = 0;
  @observable applicationId: number = 0;
  @observable isEdit: boolean = false;
  @observable isLoading: boolean = false;
  @observable readyToLoad: boolean = false; // Flag to prevent premature loading

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
      this.customerId = 0;
      this.applicationId = 0;
      this.isEdit = false;
      this.isLoading = false;
      this.readyToLoad = false;
    });
  }

  setFilters = (customerId?: number, applicationId?: number) => {
    runInAction(() => {
      this.readyToLoad = false; // Prevent loading while setting filters
      this.customerId = customerId || 0;
      this.applicationId = applicationId || 0;
      this.readyToLoad = true; // Now ready to load with correct filters
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

  loadApplicationPaidInvoices = async () => {
    // Only proceed if we're ready to load with proper filters
    if (!this.readyToLoad || this.isLoading) {
      return Promise.resolve(); // Return empty promise when not ready
    }
    
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      // Priority: applicationId > customerId > all records
      if (this.applicationId !== 0) {
        // Load invoices for specific application
        await this.apiCall(
          () => getApplicationPaidInvoicesByApplicationId(this.applicationId),
          (data) => {
            if (Array.isArray(data)) {
              runInAction(() => {
                this.data = data;
              });
            }
          }
        );
      } else if (this.customerId !== 0) {
        // Load invoices for specific customer
        await this.apiCall(
          () => getApplicationPaidInvoicesByCustomerId(this.customerId),
          (data) => {
            if (Array.isArray(data)) {
              runInAction(() => {
                this.data = data;
              });
            }
          }
        );
      } else {
        // Load all invoices when in standalone view
        await this.apiCall(
          () => getApplicationPaidInvoices(),
          (data) => {
            if (Array.isArray(data)) {
              runInAction(() => {
                this.data = data;
              });
            }
          }
        );
      }
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  deleteApplicationPaidInvoice = (id: number) => {
    this.showConfirmDialog(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        this.apiCall(
          () => deleteApplicationPaidInvoice(id),
          () => {
            this.loadApplicationPaidInvoices();
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

export default new ApplicationPaidInvoiceListStore();