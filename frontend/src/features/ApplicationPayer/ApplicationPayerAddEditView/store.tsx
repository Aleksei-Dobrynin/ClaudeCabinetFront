import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getApplicationPayer, createApplicationPayer, updateApplicationPayer } from "api/ApplicationPayer";
import { ApplicationPayer, ApplicationPayerCreateModel } from "constants/ApplicationPayer";
import { Customer } from "constants/Customer";
import { getCustomer } from "api/Customer";
import { getApplications } from "api/Application";
import { getOrganizationTypes } from "api/OrganizationType";


interface ApplicationPayerResponse {
  id: number;
}

class ApplicationPayerStore extends BaseStore {
  @observable id: number = 0
  @observable okpo: string = ""
  @observable postalCode: string = ""
  @observable ugns: string = ""
  @observable regNumber: string = ""
  @observable lastName: string = ""
  @observable firstName: string = ""
  @observable secondName: string = ""
  @observable applicationId: number = 0
  @observable typeOrganizationId: number = 0
  @observable isPhysical: boolean = false
  @observable fullName: string = ""
  @observable address: string = ""
  @observable director: string = ""
  @observable pin: string = ""
  @observable bik: string = ""
  @observable bank_name: string = ""
  @observable account_number: string = ""


  @observable applications = []
  @observable organizationTypes = []



  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
      this.okpo = ""
      this.postalCode = ""
      this.bank_name = ""
      this.ugns = ""
      this.regNumber = ""
      this.lastName = ""
      this.firstName = ""
      this.secondName = ""
      this.applicationId = 0
      this.typeOrganizationId = 0
      this.isPhysical = false
      this.fullName = ""
      this.address = ""
      this.director = ""
      this.pin = ""
      this.bik = ""
      this.account_number = ""
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

  setMyCompany(companyId: number) {
    this.loadCustomer(companyId)
    // this.loadCustomerRequisites(companyId)
  }


  loadCustomer = async (id: number) => {
    this.apiCall(
      () => getCustomer(id),
      (data: Customer) => {
        runInAction(() => {
          this.pin = data.pin;
          this.okpo = data.okpo;
          this.postalCode = data.postalCode;
          this.ugns = data.ugns;
          this.regNumber = data.regNumber;
          this.address = data.address;
          this.director = data.director;
          this.typeOrganizationId = data.organizationTypeId;
          this.isPhysical = data.isPhysical;
          // this.customerId = data.id;
          this.fullName = data.name;
          this.bank_name = data.bank ?? "";
          this.bik = data.bik ?? "";
          this.account_number = data.payment_account ?? "";
        });
      }
    );
  };

  async onSaveClick(onSaved: (id: number) => void) {
    const data: ApplicationPayerCreateModel = {

      id: this.id - 0,
      okpo: this.okpo,
      postalCode: this.postalCode,
      ugns: this.ugns,
      regNumber: this.regNumber,
      lastName: this.lastName,
      firstName: this.firstName,
      secondName: this.secondName,
      applicationId: this.applicationId - 0,
      typeOrganizationId: this.typeOrganizationId - 0,
      fullName: this.fullName,
      address: this.address,
      director: this.director,
      pin: this.pin,
      bik: this.bik,
      account_number: this.account_number,
      bank_name: this.bank_name,
    };

    if (data.typeOrganizationId === 0) {
      data.typeOrganizationId = null;
    }

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createApplicationPayer(data) :
      () => updateApplicationPayer(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: ApplicationPayerResponse) => {
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

    await this.loadApplications();
    await this.loadOrganizationTypes();


    if (id) {
      this.id = id;
      await this.loadApplicationPayer(id);
    }
  }

  loadApplicationPayer = async (id: number) => {
    this.apiCall(
      () => getApplicationPayer(id),
      (data: ApplicationPayer) => {
        runInAction(() => {

          this.id = data.id;
          this.okpo = data.okpo;
          this.postalCode = data.postalCode;
          this.ugns = data.ugns;
          this.regNumber = data.regNumber;
          this.lastName = data.lastName;
          this.firstName = data.firstName;
          this.secondName = data.secondName;
          this.applicationId = data.applicationId;
          this.typeOrganizationId = data.typeOrganizationId;
          this.fullName = data.fullName;
          this.address = data.address;
          this.director = data.director;
          this.pin = data.pin;
          this.bik = data.bik;
          this.account_number = data.account_number;
          this.bank_name = data.bank_name;
        });
      }
    );
  };


  loadApplications = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplications();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.applications = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
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

export default new ApplicationPayerStore();
