import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getApplicationStatusHistory, createApplicationStatusHistory, updateApplicationStatusHistory } from "api/ApplicationStatusHistory";
import { ApplicationStatusHistory, ApplicationStatusHistoryCreateModel } from "constants/ApplicationStatusHistory";

import { getApplicationStatuses } from "api/ApplicationStatus";
    
    
import { getApplications } from "api/Application";
    

interface ApplicationStatusHistoryResponse {
  id: number;
}

class ApplicationStatusHistoryStore extends BaseStore {
  @observable id: number = 0
	@observable statusId: number = 0
	@observable oldStatusId: number = 0
	@observable applicationId: number = 0
	

  @observable applicationStatuses = []
	@observable applications = []
	


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
		this.statusId = 0
		this.oldStatusId = 0
		this.applicationId = 0
		
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
    const data: ApplicationStatusHistoryCreateModel = {
      
      id: this.id - 0,
      statusId: this.statusId - 0,
      oldStatusId: this.oldStatusId - 0,
      applicationId: this.applicationId - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createApplicationStatusHistory(data) :
      () => updateApplicationStatusHistory(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: ApplicationStatusHistoryResponse) => {
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

    await this.loadApplicationStatuses();
		await this.loadApplications();
		

    if (id) {
      this.id = id;
      await this.loadApplicationStatusHistory(id);
    }
  }

  loadApplicationStatusHistory = async (id: number) => {
    this.apiCall(
      () => getApplicationStatusHistory(id),
      (data: ApplicationStatusHistory) => {
        runInAction(() => {
          
          this.id = data.id;
          this.statusId = data.statusId;
          this.oldStatusId = data.oldStatusId;
          this.applicationId = data.applicationId;
        });
      }
    );
  };

  
  loadApplicationStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationStatuses();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.applicationStatuses = response.data
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

export default new ApplicationStatusHistoryStore();
