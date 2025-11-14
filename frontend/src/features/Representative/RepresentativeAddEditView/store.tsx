import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getRepresentative, createRepresentative, updateRepresentative } from "api/Representative";
import { Representative, RepresentativeCreateModel } from "constants/Representative";

import { getCustomers } from "api/Customer";

import { getRepresentativeTypes } from "api/RepresentativeType";


interface RepresentativeResponse {
  id: number;
}

class RepresentativeStore extends BaseStore {
  @observable id: number = 0
  @observable firstName: string = ""
  @observable secondName: string = ""
  @observable pin: string = ""
  @observable companyId: number = 0
  @observable hasAccess: boolean = false
  @observable typeId: number = 0
  @observable lastName: string = ""
  @observable phone: string = ""
  @observable email: string = ""
  
  @observable customers = []
  @observable representativeTypes = []



  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
      this.firstName = ""
      this.secondName = ""
      this.pin = ""
      this.companyId = 0
      this.hasAccess = false
      this.typeId = 0
      this.lastName = ""
      this.phone = ""
      this.email = ""
    });
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  async onSaveClick(onSaved: (id: number) => void) {
    const data: RepresentativeCreateModel = {

      id: this.id - 0,
      firstName: this.firstName,
      secondName: this.secondName,
      pin: this.pin,
      companyId: this.companyId - 0,
      hasAccess: this.hasAccess,
      typeId: this.typeId - 0,
      lastName: this.lastName,
      phone: this.phone,
      email: this.email,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createRepresentative(data) :
      () => updateRepresentative(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: RepresentativeResponse) => {
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

  async doLoad(id: number) {


    await this.loadCustomers();
    await this.loadRepresentativeTypes();


    if (id) {
      this.id = id;
      await this.loadRepresentative(id);
    }
  }

  loadRepresentative = async (id: number) => {
    this.apiCall(
      () => getRepresentative(id),
      (data: Representative) => {
        runInAction(() => {

          this.id = data.id;
          this.firstName = data.firstName;
          this.secondName = data.secondName;
          this.pin = data.pin;
          this.companyId = data.companyId;
          this.hasAccess = data.hasAccess;
          this.typeId = data.typeId;
          this.lastName = data.lastName;
          this.phone = data.phone;
          this.email = data.email;
        });
      }
    );
  };


  loadCustomers = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomers();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.customers = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadRepresentativeTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getRepresentativeTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.representativeTypes = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };


}

export default new RepresentativeStore();
