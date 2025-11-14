import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import { Dayjs } from "dayjs";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getContactType, createContactType, updateContactType } from "api/ContactType";
import { ContactType, ContactTypeCreateModel } from "constants/ContactType";

import MainStore from "../../../MainStore";


interface ContactTypeResponse {
  id: number;
}

/**
 * Store for managing ContactType edit form data and operations
 */
class ContactTypeStore extends BaseStore {
  // Form fields
  @observable id: number = 0;
  @observable name: string;
  @observable code: string;
  @observable description: string;


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
      this.code = "";
      this.description = "";
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
    const data: ContactTypeCreateModel = {
      id: this.id,
      name: this.name,
      code: this.code,
      description: this.description
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
      () => createContactType(data) :
      () => updateContactType(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: ContactTypeResponse) => {
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
   * Load ContactType data by ID
   * @param id - ContactType ID to load
   */
  loadContactType = async (id: number) => {
    this.apiCall(
      () => getContactType(id),
      (data: ContactType) => {
        runInAction(() => {
          this.id = data.id;
          this.name = data.name;
          this.code = data.code;
          this.description = data.description;
        });
      }
    );
  };

  /**
   * Initialize the form for a given ID
   * @param id - ContactType ID to load
   */
  async doLoad(id: number) {
    if (id) {
      this.id = id;
      await this.loadContactType(id);
    }
  }
}

export default new ContactTypeStore();