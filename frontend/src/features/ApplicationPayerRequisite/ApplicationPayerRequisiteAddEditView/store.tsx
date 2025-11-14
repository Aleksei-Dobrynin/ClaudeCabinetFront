import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getApplicationPayerRequisite, createApplicationPayerRequisite, updateApplicationPayerRequisite } from "api/ApplicationPayerRequisite";
import { ApplicationPayerRequisite, ApplicationPayerRequisiteCreateModel } from "constants/ApplicationPayerRequisite";

import { getApplicationPayers } from "api/ApplicationPayer";
    

interface ApplicationPayerRequisiteResponse {
  id: number;
}

class ApplicationPayerRequisiteStore extends BaseStore {
  @observable id: number = 0
	@observable paymentAccount: string = ""
	@observable bank: string = ""
	@observable bik: string = ""
	@observable applicationPayerId: number = 0
	

  @observable applicationPayers = []
	


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
		this.applicationPayerId = 0
		
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
    const data: ApplicationPayerRequisiteCreateModel = {
      
      id: this.id - 0,
      paymentAccount: this.paymentAccount,
      bank: this.bank,
      bik: this.bik,
      applicationPayerId: this.applicationPayerId - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createApplicationPayerRequisite(data) :
      () => updateApplicationPayerRequisite(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: ApplicationPayerRequisiteResponse) => {
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

    await this.loadApplicationPayers();
		

    if (id) {
      this.id = id;
      await this.loadApplicationPayerRequisite(id);
    }
  }

  loadApplicationPayerRequisite = async (id: number) => {
    this.apiCall(
      () => getApplicationPayerRequisite(id),
      (data: ApplicationPayerRequisite) => {
        runInAction(() => {
          
          this.id = data.id;
          this.paymentAccount = data.paymentAccount;
          this.bank = data.bank;
          this.bik = data.bik;
          this.applicationPayerId = data.applicationPayerId;
        });
      }
    );
  };

  
  loadApplicationPayers = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationPayers();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.applicationPayers = response.data
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

export default new ApplicationPayerRequisiteStore();
