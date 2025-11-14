import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getCustomer, createCustomer, updateCustomer, getMyCompany } from "api/Customer";
import { Customer, CustomerCreateModel } from "constants/Customer";

import { getOrganizationTypes } from "api/OrganizationType";
import { CustomerRequisite } from "constants/CustomerRequisite";
import { getCustomerRequisitesByOrganizationId } from "api/CustomerRequisite";
import { CountryPhone } from 'constants/countrieCodes';


interface CustomerResponse {
  id: number;
}

type IdentityDocumentType = {
  id: number;
  name: string;
  code: string;
};

class CustomerStore extends BaseStore {
  @observable id: number = 0
  @observable pin: string = ""
  @observable okpo: string = ""
  @observable postalCode: string = ""
  @observable ugns: string = ""
  @observable regNumber: string = ""
  @observable organizationTypeId: number = 0
  @observable name: string = ""
  @observable lastName: string = ""
  @observable firstName: string = ""
  @observable secondName: string = ""
  @observable address: string = ""
  @observable director: string = ""
  @observable nomer: string = ""
  @observable phone1: string = ""
  @observable phone2: string = ""
  @observable email: string = ""
  @observable passport_series: string = "";
  @observable passport_issued_date: Dayjs = null;
  @observable passport_whom_issued: string = "";
  
  @observable allowNotification: boolean = false
  @observable isPhysical: boolean = false

  @observable requisits: CustomerRequisite[] = []
  @observable dataChanged: boolean;
  @observable identity_document_type_id: number;
  @observable Identity_document_types: IdentityDocumentType[] = [
    {
      "id": 1,
      "name": "Паспорт гражданина/Жарандын паспорту",
      "code": "passport"
    },
    {
      "id": 2,
      "name": "Вид на жительство/Жашап турууга уруксат",
      "code": "residence"
    }
  ];
  @observable email_2: string;


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
      this.requisits = [];
      this.allowNotification = false;
      this.isPhysical = false;
      this.lastName = "";
      this.firstName = "";
      this.secondName = "";
      this.passport_series = "";
      this.passport_issued_date = null;
      this.passport_whom_issued = "";
      this.identity_document_type_id = 0;
      this.email_2 = "";
    });
  }

  handleChange(event: { target: { name: string; value: any; }; }): void {
    super.handleChange(event)
    this.dataChanged = true;
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  async onSaveClick() {

    if(!this.dataChanged && this.id !== 0){
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
      name: this.isPhysical
        ? [this.lastName, this.firstName, this.secondName].filter(Boolean).join(" ").trim()
        : this.name,
      address: this.address,
      director: this.director,
      nomer: this.nomer,
      phone1: this.phone1,
      phone2: this.phone2,
      email: this.email,
      email_2: this.email_2,
      requisits: this.requisits,
      allowNotification: this.allowNotification,
      isPhysical: this.isPhysical,
      identity_document_type_code: this.Identity_document_types.find(x => x.id == this.identity_document_type_id)?.code ?? "",
      identity_document_type_id: this.identity_document_type_id,
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
        this.loadCustomer()
        MainStore.getCurrentUserInfo()
      }
    );
  };

  async doLoad() {
    await this.loadOrganizationTypes();

    this.loadCustomer()
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

  handlePhoneChange(name: string, value: string, country: CountryPhone) {
    this.dataChanged = true;
    
    this[name] = value;
    
    this[`${name}Country`] = country;
    
    if (this.errors[name]) {
      this.errors[name] = '';
    }
  }
  
  loadCustomer = async () => {
    this.apiCall(
      () => getCustomer(MainStore.myCompany?.id || 0),
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
          if (data.isPhysical && data.name) {
            const parts = data.name.trim().split(/\s+/);
            this.lastName = parts[0] || "";
            this.firstName = parts[1] || "";
            this.secondName = parts[2] || "";
          }
          this.address = data.address;
          this.director = data.director;
          this.nomer = data.nomer;
          this.phone1 = data.phone1;
          this.phone2 = data.phone2;
          this.email = data.email;
          this.email_2 = data.email_2;
          this.allowNotification = data.allowNotification;
          this.isPhysical = data.isPhysical;
          this.identity_document_type_id = this.Identity_document_types.find(x => x.code == data.identity_document_type_code)?.id ?? 0;
          this.passport_series = data.passport_series;
          this.passport_issued_date = dayjs(data.passport_issued_date);
          this.passport_whom_issued = data.passport_whom_issued;
        });
        this.loadCustomerRequisites(this.id)
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
