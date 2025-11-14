import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getCustomerRequisite, createCustomerRequisite, updateCustomerRequisite } from "api/CustomerRequisite";
import { CustomerRequisite, CustomerRequisiteCreateModel } from "constants/CustomerRequisite";

import { getCustomers } from "api/Customer";


interface CustomerRequisiteResponse {
  id: number;
}

class CustomerRequisiteStore extends BaseStore {
  @observable id: number = 0
  @observable paymentAccount: string = ""
  @observable bank: string = ""
  @observable bik: string = ""
  @observable organizationId: number = 0


  @observable customers = []



  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
      this.paymentAccount = ""
      this.bank = ""
      this.bik = ""
      this.organizationId = 0

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

  async onSaveClick(onSaved: (requis: CustomerRequisite) => void) {
    const data: CustomerRequisiteCreateModel = {

      id: this.id - 0,
      paymentAccount: this.paymentAccount,
      bank: this.bank,
      bik: this.bik,
      organizationId: this.organizationId - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    onSaved(data)

    // Determine whether to create or update
    // const apiMethod = data.id === 0 ?
    //   () => createCustomerRequisite(data) :
    //   () => updateCustomerRequisite(data);

    // // Make API call with inherited method
    // this.apiCall(
    //   apiMethod,
    //   (response: CustomerRequisiteResponse) => {
    //     if (data.id === 0) {
    //       runInAction(() => {
    //         this.id = response.id;
    //       });
    //       this.showSuccessSnackbar(i18n.t("message:snackbar.successSave"));
    //     } else {
    //       this.showSuccessSnackbar(i18n.t("message:snackbar.successEdit"));
    //     }
    //     onSaved(response.id || this.id);
    //   }
    // );
  };

  async setData(data: CustomerRequisite) {
    runInAction(() => {
      this.id = data.id
      this.bank = data.bank
      this.bik = data.bik
      this.paymentAccount = data.paymentAccount
    })
    // await this.loadCustomers();


    // if (id) {
    //   this.id = id;
    //   await this.loadCustomerRequisite(id);
    // }
  }

  loadCustomerRequisite = async (id: number) => {
    this.apiCall(
      () => getCustomerRequisite(id),
      (data: CustomerRequisite) => {
        runInAction(() => {

          this.id = data.id;
          this.paymentAccount = data.paymentAccount;
          this.bank = data.bank;
          this.bik = data.bik;
          this.organizationId = data.organizationId;
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


}

export default new CustomerRequisiteStore();
