import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getPayerContact, createPayerContact, updatePayerContact } from "api/PayerContact";
import { PayerContact, PayerContactCreateModel } from "constants/PayerContact";

import { getPayers } from "api/Payer";
    

interface PayerContactResponse {
  id: number;
}

class PayerContactStore extends BaseStore {
  @observable id: number = 0
	@observable value: string = ""
	@observable allowNotification: boolean = false
	@observable rTypeId: number = 0
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
		this.value = ""
		this.allowNotification = false
		this.rTypeId = 0
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
    const data: PayerContactCreateModel = {
      
      id: this.id - 0,
      value: this.value,
      allowNotification: this.allowNotification,
      rTypeId: this.rTypeId - 0,
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
      () => createPayerContact(data) :
      () => updatePayerContact(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: PayerContactResponse) => {
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
      await this.loadPayerContact(id);
    }
  }

  loadPayerContact = async (id: number) => {
    this.apiCall(
      () => getPayerContact(id),
      (data: PayerContact) => {
        runInAction(() => {
          
          this.id = data.id;
          this.value = data.value;
          this.allowNotification = data.allowNotification;
          this.rTypeId = data.rTypeId;
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

export default new PayerContactStore();
