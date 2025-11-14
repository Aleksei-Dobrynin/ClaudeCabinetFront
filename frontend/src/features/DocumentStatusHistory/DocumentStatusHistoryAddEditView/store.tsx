import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getDocumentStatusHistory, createDocumentStatusHistory, updateDocumentStatusHistory } from "api/DocumentStatusHistory";
import { DocumentStatusHistory, DocumentStatusHistoryCreateModel } from "constants/DocumentStatusHistory";

import { getUploadedApplicationDocuments } from "api/UploadedApplicationDocument";
    
import { getDocumentStatuses } from "api/DocumentStatus";
    

interface DocumentStatusHistoryResponse {
  id: number;
}

class DocumentStatusHistoryStore extends BaseStore {
  @observable id: number = 0
	@observable documentId: number = 0
	@observable statusId: number = 0
	@observable description: string = ""
	@observable oldStatusId: number = 0
	

  @observable uploadedApplicationDocuments = []
	@observable documentStatuses = []
	


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
		this.documentId = 0
		this.statusId = 0
		this.description = ""
		this.oldStatusId = 0
		
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
    const data: DocumentStatusHistoryCreateModel = {
      
      id: this.id - 0,
      documentId: this.documentId - 0,
      statusId: this.statusId - 0,
      description: this.description,
      oldStatusId: this.oldStatusId - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createDocumentStatusHistory(data) :
      () => updateDocumentStatusHistory(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: DocumentStatusHistoryResponse) => {
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

    await this.loadUploadedApplicationDocuments();
		await this.loadDocumentStatuses();
		

    if (id) {
      this.id = id;
      await this.loadDocumentStatusHistory(id);
    }
  }

  loadDocumentStatusHistory = async (id: number) => {
    this.apiCall(
      () => getDocumentStatusHistory(id),
      (data: DocumentStatusHistory) => {
        runInAction(() => {
          
          this.id = data.id;
          this.documentId = data.documentId;
          this.statusId = data.statusId;
          this.description = data.description;
          this.oldStatusId = data.oldStatusId;
        });
      }
    );
  };

  
  loadUploadedApplicationDocuments = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getUploadedApplicationDocuments();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.uploadedApplicationDocuments = response.data
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

export default new DocumentStatusHistoryStore();
