import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getSDocumenttemplate, createSDocumenttemplate, updateSDocumenttemplate } from "api/SDocumenttemplate";
import { SDocumenttemplate, SDocumenttemplateCreateModel } from "constants/SDocumenttemplate";


interface SDocumenttemplateResponse {
  id: number;
}

class SDocumenttemplateStore extends BaseStore {
  @observable id: number = 0
	@observable nameKg: string = ""
	@observable descriptionKg: string = ""
	@observable textColor: string = ""
	@observable backgroundColor: string = ""
	@observable name: string = ""
	@observable description: string = ""
	@observable code: string = ""
	@observable idcustomsvgicon: number = 0
	@observable iconcolor: string = ""
	@observable iddocumenttype: number = 0
	

  


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
		this.nameKg = ""
		this.descriptionKg = ""
		this.textColor = ""
		this.backgroundColor = ""
		this.name = ""
		this.description = ""
		this.code = ""
		this.idcustomsvgicon = 0
		this.iconcolor = ""
		this.iddocumenttype = 0
		
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
    const data: SDocumenttemplateCreateModel = {
      
      id: this.id - 0,
      nameKg: this.nameKg,
      descriptionKg: this.descriptionKg,
      textColor: this.textColor,
      backgroundColor: this.backgroundColor,
      name: this.name,
      description: this.description,
      code: this.code,
      idcustomsvgicon: this.idcustomsvgicon - 0,
      iconcolor: this.iconcolor,
      iddocumenttype: this.iddocumenttype - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createSDocumenttemplate(data) :
      () => updateSDocumenttemplate(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: SDocumenttemplateResponse) => {
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

    

    if (id) {
      this.id = id;
      await this.loadSDocumenttemplate(id);
    }
  }

  loadSDocumenttemplate = async (id: number) => {
    this.apiCall(
      () => getSDocumenttemplate(id),
      (data: SDocumenttemplate) => {
        runInAction(() => {
          
          this.id = data.id;
          this.nameKg = data.nameKg;
          this.descriptionKg = data.descriptionKg;
          this.textColor = data.textColor;
          this.backgroundColor = data.backgroundColor;
          this.name = data.name;
          this.description = data.description;
          this.code = data.code;
          this.idcustomsvgicon = data.idcustomsvgicon;
          this.iconcolor = data.iconcolor;
          this.iddocumenttype = data.iddocumenttype;
        });
      }
    );
  };

  

}

export default new SDocumenttemplateStore();
