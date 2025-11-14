import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getNotificationLog, createNotificationLog, updateNotificationLog } from "api/NotificationLog";
import { NotificationLog, NotificationLogCreateModel } from "constants/NotificationLog";

import { getApplications } from "api/Application";
    

interface NotificationLogResponse {
  id: number;
}

class NotificationLogStore extends BaseStore {
  @observable id: number = 0
	@observable text: string = ""
	@observable title: string = ""
	@observable applicationId: number = 0
	@observable contact: string = ""
	@observable dateSend: string = ""
	@observable rContactTypeId: string = ""
	

  @observable applications = []
	


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
		this.text = ""
		this.title = ""
		this.applicationId = 0
		this.contact = ""
		this.dateSend = ""
		this.rContactTypeId = ""
		
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
    const data: NotificationLogCreateModel = {
      
      id: this.id - 0,
      text: this.text,
      title: this.title,
      applicationId: this.applicationId - 0,
      contact: this.contact,
      dateSend: this.dateSend,
      rContactTypeId: this.rContactTypeId,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createNotificationLog(data) :
      () => updateNotificationLog(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: NotificationLogResponse) => {
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
		

    if (id) {
      this.id = id;
      await this.loadNotificationLog(id);
    }
  }

  loadNotificationLog = async (id: number) => {
    this.apiCall(
      () => getNotificationLog(id),
      (data: NotificationLog) => {
        runInAction(() => {
          
          this.id = data.id;
          this.text = data.text;
          this.title = data.title;
          this.applicationId = data.applicationId;
          this.contact = data.contact;
          this.dateSend = data.dateSend;
          this.rContactTypeId = data.rContactTypeId;
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
    

}

export default new NotificationLogStore();
