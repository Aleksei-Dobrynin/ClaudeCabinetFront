import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getPayer, createPayer, updatePayer } from "api/Payer";
import { Payer, PayerCreateModel } from "constants/Payer";
import { Customer } from "constants/Customer";
import { getCustomer} from "api/Customer";

import { getOrganizationTypes } from "api/OrganizationType";


interface PayerResponse {
  id: number;
}

class PayerStore extends BaseStore {
  @observable id: number = 0
  @observable okpo: string = ""
  @observable postalCode: string = ""
  @observable ugns: string = ""
  @observable regNumber: string = ""
  @observable typeOrganizationId: number = 0
  @observable customerId: number = 0
  @observable lastName: string = ""
  @observable firstName: string = ""
  @observable secondName: string = ""
  @observable fullName: string = ""
  @observable address: string = ""
  @observable director: string = ""
  @observable pin: string = ""


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
      this.ugns = ""
      this.regNumber = ""
      this.typeOrganizationId = 0
      this.customerId = 0
      this.lastName = ""
      this.firstName = ""
      this.secondName = ""
      this.fullName = ""
      this.address = ""
      this.director = ""
      this.pin = ""

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
    const data: PayerCreateModel = {

      id: this.id - 0,
      okpo: this.okpo,
      postalCode: this.postalCode,
      ugns: this.ugns,
      regNumber: this.regNumber,
      typeOrganizationId: this.typeOrganizationId - 0,
      customerId: this.customerId - 0,
      lastName: this.lastName,
      firstName: this.firstName,
      secondName: this.secondName,
      fullName: this.fullName,
      address: this.address,
      director: this.director,
      pin: this.pin,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createPayer(data) :
      () => updatePayer(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: PayerResponse) => {
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

    await this.loadOrganizationTypes();


    if (id) {
      this.id = id;
      await this.loadPayer(id);
    }
  }

  setMyCompany(companyId: number){
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
            this.customerId = data.id;
            this.fullName = data.name;
          });
        }
      );
    };
  
  loadPayer = async (id: number) => {
    this.apiCall(
      () => getPayer(id),
      (data: Payer) => {
        runInAction(() => {

          this.id = data.id;
          this.okpo = data.okpo;
          this.postalCode = data.postalCode;
          this.ugns = data.ugns;
          this.regNumber = data.regNumber;
          this.typeOrganizationId = data.typeOrganizationId;
          this.customerId = data.customerId;
          this.lastName = data.lastName;
          this.firstName = data.firstName;
          this.secondName = data.secondName;
          this.fullName = data.fullName;
          this.address = data.address;
          this.director = data.director;
          this.pin = data.pin;
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

export default new PayerStore();
