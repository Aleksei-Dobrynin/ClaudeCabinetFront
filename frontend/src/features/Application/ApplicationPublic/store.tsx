import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getApplication, createApplication, updateApplication, getApplicationByGuid } from "api/Application";
import { Application, ApplicationCreateModel, ApplicationWorkDocumentFromBga, UploadedDocumentFromBga } from "constants/Application";

import { getArchObjects } from "api/ArchObject";
import { getApplicationStatuses } from "api/ApplicationStatus";
import { getCustomers } from "api/Customer";

interface ApplicationResponse {
  id: number;
}

class ApplicationStore extends BaseStore {
  @observable id: number = 0
  @observable workDescription: string = ""
  @observable archObjectId: number = 0
  @observable statusId: number = 0
  @observable statusName: string = ""
  @observable companyId: number = 0
  @observable customerName: string = ""
  @observable customerPin: string = ""
  @observable objAddress: string = ""
  @observable rServiceId: number = 0
  @observable rServiceName: string = ""
  @observable uniqueCode: string = ""
  @observable registrationDate: Dayjs = null
  @observable deadline: Dayjs = null
  @observable number: string = ""
  @observable comment: string = ""

  @observable uploadDocuments: UploadedDocumentFromBga[] = []
  @observable workDocuments: ApplicationWorkDocumentFromBga[] = []
  @observable mainApplication = null

  @observable archObjects = []
  @observable applicationStatuses = []
  @observable customers = []

  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
      this.workDescription = ""
      this.archObjectId = 0
      this.statusId = 0
      this.companyId = 0
      this.rServiceId = 0
      this.rServiceName = ""
      this.uniqueCode = ""
      this.registrationDate = null
      this.deadline = null
      this.number = ""
      this.comment = ""
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
    const data: ApplicationCreateModel = {
      id: this.id - 0,
      workDescription: this.workDescription,
      archObjectId: this.archObjectId - 0,
      statusId: this.statusId - 0,
      companyId: this.companyId - 0,
      rServiceId: this.rServiceId - 0,
      rServiceName: this.rServiceName,
      uniqueCode: this.uniqueCode,
      registrationDate: this.registrationDate,
      deadline: this.deadline,
      number: this.number,
      comment: this.comment,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createApplication(data) :
      () => updateApplication(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: ApplicationResponse) => {
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

  async doLoad(guid: string) {
    await this.loadApplication(guid);
  }

  loadApplication = async (guid: string) => {
    this.apiCall(
      () => getApplicationByGuid(guid),
      (data: Application) => {
        runInAction(() => {
          this.id = data.id;
          this.workDescription = data.workDescription;
          this.archObjectId = data.archObjectId;
          this.statusId = data.statusId;
          this.statusName = data.statusName;
          this.companyId = data.companyId;
          this.rServiceId = data.rServiceId;
          this.rServiceName = data.rServiceName;
          this.uniqueCode = data.uniqueCode;
          this.registrationDate = dayjs(data.registrationDate);
          this.deadline = dayjs(data.deadline);
          this.number = data.number;
          this.comment = data.comment;
          this.uploadDocuments = data.uploadDocuments;
          this.workDocuments = data.workDocuments;
          this.mainApplication = data.mainApplication;
        });
      }
    );
  };

  loadArchObjects = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchObjects();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.archObjects = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
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

export default new ApplicationStore();