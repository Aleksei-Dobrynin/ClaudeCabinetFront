import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getUploadedApplicationDocument, createUploadedApplicationDocumentWithFile, updateUploadedApplicationDocumentWithFile } from "api/UploadedApplicationDocument";
import { UploadedApplicationDocument } from "constants/UploadedApplicationDocument";

import { getApplications } from "api/Application";

// import { getAppFiles } from "api/AppFile";

import { getDocumentStatuses } from "api/DocumentStatus";


interface UploadedApplicationDocumentResponse {
  id: number;
}

class UploadedApplicationDocumentStore extends BaseStore {
  @observable id: number = 0
  @observable hashCode: string = ""
  @observable hashCodeDate: Dayjs = null
  @observable serviceDocumentId: number = 0
  @observable isSigned: boolean = false
  @observable fileId: number = 0
  @observable name: string = ""
  @observable applicationId: number = 0
  @observable statusId: number = 0

  @observable fileName: string = "";
  @observable file: File = null;
  @observable idDocumentinputKey: string = "";
  @observable applications = []
  @observable appFiles = []
  @observable documentStatuses = []



  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
      this.hashCode = ""
      this.hashCodeDate = null
      this.serviceDocumentId = 0
      this.isSigned = false
      this.fileId = 0
      this.name = ""
      this.applicationId = 0
      this.statusId = 0
      this.file = null
      this.fileName = ""
      this.changeDocInputKey()

    });
  }

  changeDocInputKey() {
    this.idDocumentinputKey = Math.random().toString(36);
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
    const data: UploadedApplicationDocument = {

      id: this.id - 0,
      hashCode: this.hashCode,
      hashCodeDate: dayjs(),
      serviceDocumentId: this.serviceDocumentId - 0,
      isSigned: this.isSigned,
      fileId: this.fileId - 0,
      name: this.name,
      applicationId: this.applicationId - 0,
      statusId: this.statusId - 0,
      fileName: this.fileName,
      // file: this.file,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createUploadedApplicationDocumentWithFile(data, this.fileName, this.file) :
      () => updateUploadedApplicationDocumentWithFile(data, this.fileName, this.file);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: UploadedApplicationDocumentResponse) => {
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

    // await this.loadApplications();
    // await this.loadDocumentStatuses();


    if (id) {
      this.id = id;
      await this.loadUploadedApplicationDocument(id);
    }
  }

  loadUploadedApplicationDocument = async (id: number) => {
    this.apiCall(
      () => getUploadedApplicationDocument(id),
      (data: UploadedApplicationDocument) => {
        runInAction(() => {

          this.id = data.id;
          this.hashCode = data.hashCode;
          this.hashCodeDate = dayjs(data.hashCodeDate);
          this.serviceDocumentId = data.serviceDocumentId;
          this.isSigned = data.isSigned;
          this.fileId = data.fileId;
          this.name = data.name;
          this.applicationId = data.applicationId;
          this.statusId = data.statusId;
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


  loadDocumentStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDocumentStatuses();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.documentStatuses = response.data
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

export default new UploadedApplicationDocumentStore();
