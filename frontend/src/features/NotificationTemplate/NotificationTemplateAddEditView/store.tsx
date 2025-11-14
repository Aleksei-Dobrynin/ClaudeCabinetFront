import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getNotificationTemplate, createNotificationTemplate, updateNotificationTemplate } from "api/NotificationTemplate";
import { NotificationTemplate, NotificationTemplateCreateModel } from "constants/NotificationTemplate";
import { ContactType } from "constants/ContactType";
import { getContactTypes } from "api/ContactType";


interface NotificationTemplateResponse {
  id: number;
}

class NotificationTemplateStore extends BaseStore {
  @observable id: number = 0
  @observable contactTypeId: number = 0
  @observable code: string = ""
  @observable subject: string = ""
  @observable body: string = ""
  @observable placeholders: string = ""
  @observable link: string = ""


  @observable contactTypes: ContactType[] = []




  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
      this.contactTypeId = 0
      this.code = ""
      this.subject = ""
      this.body = ""
      this.placeholders = ""
      this.link = ""

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
    const data: NotificationTemplateCreateModel = {

      id: this.id - 0,
      contactTypeId: this.contactTypeId - 0 === 0 ? null : this.contactTypeId - 0,
      code: this.code,
      subject: this.subject,
      body: this.body,
      placeholders: this.placeholders,
      link: this.link,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createNotificationTemplate(data) :
      () => updateNotificationTemplate(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: NotificationTemplateResponse) => {
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

  loadContactTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getContactTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.contactTypes = response.data
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async doLoad(id: number) {

    this.loadContactTypes()

    if (id) {
      this.id = id;
      await this.loadNotificationTemplate(id);
    }
  }

  loadNotificationTemplate = async (id: number) => {
    this.apiCall(
      () => getNotificationTemplate(id),
      (data: NotificationTemplate) => {
        runInAction(() => {

          this.id = data.id;
          this.contactTypeId = data.contactTypeId;
          this.code = data.code;
          this.subject = data.subject;
          this.body = data.body;
          this.placeholders = data.placeholders;
          this.link = data.link;
        });
      }
    );
  };



}

export default new NotificationTemplateStore();
