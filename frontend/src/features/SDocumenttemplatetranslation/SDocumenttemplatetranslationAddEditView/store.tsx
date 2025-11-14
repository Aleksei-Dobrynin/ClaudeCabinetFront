import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getSDocumenttemplatetranslation, createSDocumenttemplatetranslation, updateSDocumenttemplatetranslation } from "api/SDocumenttemplatetranslation";
import { SDocumenttemplatetranslation, SDocumenttemplatetranslationCreateModel } from "constants/SDocumenttemplatetranslation";

import { getSDocumenttemplates } from "api/SDocumenttemplate";
    
import { getLanguages } from "api/Language";
    

interface SDocumenttemplatetranslationResponse {
  id: number;
}

class SDocumenttemplatetranslationStore extends BaseStore {
  @observable id: number = 0
	@observable template: string = ""
	@observable iddocumenttemplate: number = 0
	@observable idlanguage: number = 0
	

  @observable sDocumenttemplates = []
	@observable languages = []
	


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
		this.template = ""
		this.iddocumenttemplate = 0
		this.idlanguage = 0
		
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
    const data: SDocumenttemplatetranslationCreateModel = {
      
      id: this.id - 0,
      template: this.template,
      iddocumenttemplate: this.iddocumenttemplate - 0,
      idlanguage: this.idlanguage - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createSDocumenttemplatetranslation(data) :
      () => updateSDocumenttemplatetranslation(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: SDocumenttemplatetranslationResponse) => {
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

    await this.loadSDocumenttemplates();
		await this.loadLanguages();
		

    if (id) {
      this.id = id;
      await this.loadSDocumenttemplatetranslation(id);
    }
  }

  loadSDocumenttemplatetranslation = async (id: number) => {
    this.apiCall(
      () => getSDocumenttemplatetranslation(id),
      (data: SDocumenttemplatetranslation) => {
        runInAction(() => {
          
          this.id = data.id;
          this.template = data.template;
          this.iddocumenttemplate = data.iddocumenttemplate;
          this.idlanguage = data.idlanguage;
        });
      }
    );
  };

  
  loadSDocumenttemplates = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getSDocumenttemplates();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.sDocumenttemplates = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
    
  loadLanguages = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getLanguages();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.languages = response.data
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

export default new SDocumenttemplatetranslationStore();
