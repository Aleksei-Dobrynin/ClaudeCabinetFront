import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getCustomer, createCustomer, updateCustomer, getInfoByPin } from "api/Customer";
import { Customer, CustomerCreateModel } from "constants/Customer";

import { getOrganizationTypes } from "api/OrganizationType";
import { CustomerRequisite } from "constants/CustomerRequisite";
import { getCustomerRequisitesByOrganizationId } from "api/CustomerRequisite";
import { getCountries } from "../../../api/Country/GetCountries";
import { CountryPhone } from 'constants/countrieCodes';

interface CustomerResponse {
  id: number;
}

class CustomerStore extends BaseStore {
  @observable id: number = 0
  @observable pin: string = ""
  @observable okpo: string = ""
  @observable postalCode: string = ""
  @observable ugns: string = ""
  @observable regNumber: string = ""
  @observable organizationTypeId: number = 0
  @observable name: string = ""
  @observable address: string = ""
  @observable director: string = ""
  @observable nomer: string = ""
  @observable phone1: string = ""
  @observable phone2: string = ""
  @observable email: string = ""
  @observable is_foreign: boolean = false;
  @observable allowNotification: boolean = false;
  @observable foreign_country: null | number = null;
  @observable passport_series: string = "";
  @observable passport_issued_date: Dayjs = null;
  @observable passport_whom_issued: string = "";

  // @observable phone1Country: CountryPhone | null = null;
  // @observable phone2Country: CountryPhone | null = null;

  @observable requisits: CustomerRequisite[] = []

  @observable dataChanged: boolean;
  @observable isForeign: boolean;
  @observable isPhysical: boolean;
  @observable Countries = []
  @observable foreignCountry: number


  @observable organizationTypes = []



  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
      this.pin = ""
      this.okpo = ""
      this.postalCode = ""
      this.ugns = ""
      this.regNumber = ""
      this.organizationTypeId = 0
      this.name = ""
      this.address = ""
      this.director = ""
      this.nomer = ""
      this.phone1 = ""
      this.phone2 = ""
      this.email = ""
      this.dataChanged = false;
      this.allowNotification = false;
      this.requisits = []
      this.passport_series = "";
      this.passport_issued_date = null;
      this.passport_whom_issued = "";

      this.dataChanged = false
      this.is_foreign = false
      this.foreign_country = null

    });
  }

  handleChange(event: { target: { name: string; value: any; }; }): void {
    super.handleChange(event)
    this.dataChanged = true;
  }

  setMyCompany(companyId: number) {
    this.loadCustomer(companyId)
    this.loadCustomerRequisites(companyId)
  }

  searchInfoByPin = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getInfoByPin(this.pin);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.name = response.data.full_name;
          this.address = response.data.address;
          this.director = response.data.director;
          this.okpo = response.data.okpo;
          this.organizationTypeId = response.data.organization_type_id;
          MainStore.setSnackbar(i18n.t("message:snackbar.searchSuccess"), "success");
        });
      } else if (response.status === 204) {
        MainStore.setSnackbar(i18n.t("message:snackbar.searchNotFound"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:snackbar.searchError"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  async onSaveClick(onSaved: (id: number) => void) {

    if (!this.dataChanged && this.id !== 0) {
      onSaved(this.id)
      return
    }

    const data: CustomerCreateModel = {

      id: this.id - 0,
      pin: this.pin,
      okpo: this.okpo,
      postalCode: this.postalCode,
      ugns: this.ugns,
      regNumber: this.regNumber,
      organizationTypeId: this.organizationTypeId - 0,
      name: this.name,
      address: this.address,
      director: this.director,
      nomer: this.nomer,
      phone1: this.phone1,
      phone2: this.phone2,
      email: this.email,
      requisits: this.requisits,
      isForeign: this.isForeign,
      isPhysical: this.isPhysical,
      foreignCountry: this.foreignCountry,
      allowNotification: this.allowNotification,
      passport_series: this.passport_series,
      passport_issued_date: this.passport_issued_date,
      passport_whom_issued: this.passport_whom_issued,
    };

    if (data.organizationTypeId === 0) {
      data.organizationTypeId = null;
    }



    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createCustomer(data) :
      () => updateCustomer(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: CustomerResponse) => {
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

  async doLoad() {
    await this.loadOrganizationTypes();
    await this.loadCountries();
  }

  handlePhoneChange(name: string, value: string, country: CountryPhone) {
    this.dataChanged = true;

    this[name] = value;

    this[`${name}Country`] = country;

    if (this.errors[name]) {
      this.errors[name] = '';
    }
  }

  loadCountries = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getCountries();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Countries = response.data
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadCustomerRequisites = async (customerId: number) => {
    if (customerId === 0) return;

    this.apiCall(
      () => getCustomerRequisitesByOrganizationId(customerId),
      (data) => {
        if (Array.isArray(data)) {
          runInAction(() => {
            this.requisits = data;
          });
        }
      }
    );
  };

  handleChangeCustomer(event) {
    this[event.target.name] = event.target.value;
  }

  loadCustomer = async (id: number) => {
    this.apiCall(
      () => getCustomer(id),
      (data: Customer) => {
        runInAction(() => {

          this.id = data.id;
          this.pin = data.pin;
          this.okpo = data.okpo;
          this.postalCode = data.postalCode;
          this.ugns = data.ugns;
          this.regNumber = data.regNumber;
          this.organizationTypeId = data.organizationTypeId;
          this.name = data.name;
          this.address = data.address;
          this.director = data.director;
          this.nomer = data.nomer;
          this.phone1 = data.phone1;
          this.phone2 = data.phone2;
          this.email = data.email;
          this.foreignCountry = data.foreignCountry;
          this.isForeign = data.isForeign;
          this.isPhysical = data.isPhysical;
          this.allowNotification = data.allowNotification
          this.passport_series = data.passport_series;
          this.passport_issued_date = dayjs(data.passport_issued_date);
          this.passport_whom_issued = data.passport_whom_issued;
        });
      }
    );
  };


  loadOrganizationTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getOrganizationTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.organizationTypes = response.data
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

export default new CustomerStore();
