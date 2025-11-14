import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getApplicationCustomer, createApplicationCustomer, updateApplicationCustomer } from "api/ApplicationCustomer";
import { ApplicationCustomer, ApplicationCustomerCreateModel } from "constants/ApplicationCustomer";

import { getOrganizationTypes } from "api/OrganizationType";
    
import { getApplications } from "api/Application";
    

interface ApplicationCustomerResponse {
  id: number;
}

class ApplicationCustomerStore extends BaseStore {
  @observable id: number = 0
	@observable director: string = ""
	@observable okpo: string = ""
	@observable paymentAccount: string = ""
	@observable postalCode: string = ""
	@observable ugns: string = ""
	@observable bank: string = ""
	@observable bik: string = ""
	@observable registrationNumber: string = ""
	@observable identityDocumentTypeId: number = 0
	@observable organizationTypeId: number = 0
	@observable pin: string = ""
	@observable applicationId: number = 0
	@observable isOrganization: boolean = false
	@observable fullName: string = ""
	@observable address: string = ""
	

  @observable organizationTypes = []
	@observable applications = []
	


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
		this.director = ""
		this.okpo = ""
		this.paymentAccount = ""
		this.postalCode = ""
		this.ugns = ""
		this.bank = ""
		this.bik = ""
		this.registrationNumber = ""
		this.identityDocumentTypeId = 0
		this.organizationTypeId = 0
		this.pin = ""
		this.applicationId = 0
		this.isOrganization = false
		this.fullName = ""
		this.address = ""
		
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
    const data: ApplicationCustomerCreateModel = {
      
      id: this.id - 0,
      director: this.director,
      okpo: this.okpo,
      paymentAccount: this.paymentAccount,
      postalCode: this.postalCode,
      ugns: this.ugns,
      bank: this.bank,
      bik: this.bik,
      registrationNumber: this.registrationNumber,
      identityDocumentTypeId: this.identityDocumentTypeId - 0,
      organizationTypeId: this.organizationTypeId - 0,
      pin: this.pin,
      applicationId: this.applicationId - 0,
      isOrganization: this.isOrganization,
      fullName: this.fullName,
      address: this.address,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createApplicationCustomer(data) :
      () => updateApplicationCustomer(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: ApplicationCustomerResponse) => {
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
		await this.loadApplications();
		

    if (id) {
      this.id = id;
      await this.loadApplicationCustomer(id);
    }
  }

  loadApplicationCustomer = async (id: number) => {
    this.apiCall(
      () => getApplicationCustomer(id),
      (data: ApplicationCustomer) => {
        runInAction(() => {
          
          this.id = data.id;
          this.director = data.director;
          this.okpo = data.okpo;
          this.paymentAccount = data.paymentAccount;
          this.postalCode = data.postalCode;
          this.ugns = data.ugns;
          this.bank = data.bank;
          this.bik = data.bik;
          this.registrationNumber = data.registrationNumber;
          this.identityDocumentTypeId = data.identityDocumentTypeId;
          this.organizationTypeId = data.organizationTypeId;
          this.pin = data.pin;
          this.applicationId = data.applicationId;
          this.isOrganization = data.isOrganization;
          this.fullName = data.fullName;
          this.address = data.address;
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
    

}

export default new ApplicationCustomerStore();
