import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getPayerRequisite, createPayerRequisite, updatePayerRequisite } from "api/PayerRequisite";
import { PayerRequisite, PayerRequisiteCreateModel } from "constants/PayerRequisite";

import { getPayers } from "api/Payer";
    

interface PayerRequisiteResponse {
  id: number;
}

class PayerRequisiteStore extends BaseStore {
  @observable id: number = 0
	@observable paymentAccount: string = ""
	@observable bank: string = ""
	@observable bik: string = ""
	@observable payerId: number = 0
	

  @observable payers = []
	


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
		this.payerId = 0
		
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
    const data: PayerRequisiteCreateModel = {
      
      id: this.id - 0,
      paymentAccount: this.paymentAccount,
      bank: this.bank,
      bik: this.bik,
      payerId: this.payerId - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createPayerRequisite(data) :
      () => updatePayerRequisite(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: PayerRequisiteResponse) => {
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

    await this.loadPayers();
		

    if (id) {
      this.id = id;
      await this.loadPayerRequisite(id);
    }
  }

  loadPayerRequisite = async (id: number) => {
    this.apiCall(
      () => getPayerRequisite(id),
      (data: PayerRequisite) => {
        runInAction(() => {
          
          this.id = data.id;
          this.paymentAccount = data.paymentAccount;
          this.bank = data.bank;
          this.bik = data.bik;
          this.payerId = data.payerId;
        });
      }
    );
  };

  
  loadPayers = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getPayers();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.payers = response.data
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

export default new PayerRequisiteStore();
