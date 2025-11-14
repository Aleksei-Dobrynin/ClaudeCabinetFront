import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getService, createService, updateService } from "api/Service";
import { Service, ServiceCreateModel } from "constants/Service";
import MainStore from "../../../MainStore";


interface ServiceResponse {
  id: number;
}

/**
 * Store for managing Service edit form data and operations
 */
class ServiceStore extends BaseStore {
  // Form fields
  @observable id: number = 0;
  @observable name: string = "";
  @observable short_name: string = "";
  @observable code: string = "";
  @observable description: string = "";
  @observable day_count: number = 0;
  @observable price: number = 0;
  @observable workflow_id: number = 0;
  @observable workflow_name: string = "";

  // Reference data
  Workflows: any[] = [];

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
      this.id = 0;
      this.name = "";
      this.short_name = "";
      this.code = "";
      this.description = "";
      this.day_count = 0;
      this.price = 0;
      this.workflow_id = 0;
      this.workflow_name = "";
      this.Workflows = [];
    });
  }

  /**
   * Validate a specific field
   * @param name - Field name
   * @param value - Field value
   */
  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    runInAction(() => {
      if (isValid) {
        this.errors[name] = "";
      } else {
        this.errors[name] = error;
      }
    });
  }

  /**
   * Handle save button click
   * @param onSaved - Callback function after successful save
   */
  onSaveClick = async (onSaved: (id: number) => void) => {
    // Create data object from form fields
    const data: ServiceCreateModel = {
      id: this.id,
      name: this.name,
      short_name: this.short_name,
      code: this.code,
      description: this.description,
      day_count: this.day_count,
      price: this.price,
      workflow_id: this.workflow_id
    };

    // Validate all fields
    const { isValid, errors } = await validate(data);
    if (!isValid) {
      runInAction(() => {
        this.errors = errors;
      });
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createService(data) :
      () => updateService(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: ServiceResponse) => {
        if (data.id === 0) {
          runInAction(() => {
            this.id = response.id;
          });
          this.showSuccessSnackbar(i18n.t("message:snackbar.successSave"));
        } else {
          this.showSuccessSnackbar(i18n.t("message:snackbar.successEdit"));
        }
        onSaved(response.id || this.id);
      }
    );
  };

  /**
   * Load service data by ID
   * @param id - Service ID to load
   */
  loadService = async (id: number) => {
    this.apiCall(
      () => getService(id),
      (data: Service) => {
        runInAction(() => {
          this.id = data.id;
          this.name = data.name;
          this.short_name = data.short_name;
          this.code = data.code;
          this.description = data.description;
          this.day_count = data.day_count;
          this.price = data.price;
          this.workflow_id = data.workflow_id;
          this.workflow_name = data.workflow_name;
        });
      }
    );
  };

  /**
   * Initialize the form for a given ID
   * @param id - Service ID to load
   */
  async doLoad(id: number) {
    if (id) {
      this.id = id;
      await this.loadService(id);
    }
  }
}

export default new ServiceStore();