import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getApplicationPaidInvoice, createApplicationPaidInvoice, updateApplicationPaidInvoice } from "api/ApplicationPaidInvoice";
import { ApplicationPaidInvoice, ApplicationPaidInvoiceCreateModel } from "constants/ApplicationPaidInvoice";

import { getApplications } from "api/Application";
    
import { getCustomers } from "api/Customer";
    

interface ApplicationPaidInvoiceResponse {
  id: number;
}

class ApplicationPaidInvoiceStore extends BaseStore {
  @observable id: number = 0
	@observable applicationId: number = 0
	@observable customerId: number = 0
	@observable date: Dayjs = null
	@observable paymentIdentifier: string = ""
	@observable sum: number = 0
	@observable description: string = ""
	@observable additional: string = ""
	

  @observable applications = []
	@observable customers = []
	


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
		this.applicationId = 0
		this.customerId = 0
		this.date = null
		this.paymentIdentifier = ""
		this.sum = 0
		this.description = ""
		this.additional = ""
		
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
    const data: ApplicationPaidInvoiceCreateModel = {
      
      id: this.id - 0,
      applicationId: this.applicationId - 0,
      customerId: this.customerId - 0,
      date: this.date,
      paymentIdentifier: this.paymentIdentifier,
      sum: this.sum,
      description: this.description,
      additional: this.additional,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createApplicationPaidInvoice(data) :
      () => updateApplicationPaidInvoice(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: ApplicationPaidInvoiceResponse) => {
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
		await this.loadCustomers();
		

    if (id) {
      this.id = id;
      await this.loadApplicationPaidInvoice(id);
    }
  }

  loadApplicationPaidInvoice = async (id: number) => {
    this.apiCall(
      () => getApplicationPaidInvoice(id),
      (data: ApplicationPaidInvoice) => {
        runInAction(() => {
          
          this.id = data.id;
          this.applicationId = data.applicationId;
          this.customerId = data.customerId;
          this.date = dayjs(data.date);
          this.paymentIdentifier = data.paymentIdentifier;
          this.sum = data.sum;
          this.description = data.description;
          this.additional = data.additional;
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

export default new ApplicationPaidInvoiceStore();
