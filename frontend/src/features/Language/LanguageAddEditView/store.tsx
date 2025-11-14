import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getLanguage, createLanguage, updateLanguage } from "api/Language";
import { Language, LanguageCreateModel } from "constants/Language";


interface LanguageResponse {
  id: number;
}

class LanguageStore extends BaseStore {
  @observable name: string = ""
	@observable nameKg: string = ""
	@observable descriptionKg: string = ""
	@observable textColor: string = ""
	@observable backgroundColor: string = ""
	@observable description: string = ""
	@observable code: string = ""
	@observable isdefault: boolean = false
	@observable queuenumber: number = 0
	@observable id: number = 0
	

  


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.name = ""
		this.nameKg = ""
		this.descriptionKg = ""
		this.textColor = ""
		this.backgroundColor = ""
		this.description = ""
		this.code = ""
		this.isdefault = false
		this.queuenumber = 0
		this.id = 0
		
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
    const data: LanguageCreateModel = {
      
      name: this.name,
      nameKg: this.nameKg,
      descriptionKg: this.descriptionKg,
      textColor: this.textColor,
      backgroundColor: this.backgroundColor,
      description: this.description,
      code: this.code,
      isdefault: this.isdefault,
      queuenumber: this.queuenumber - 0,
      id: this.id - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createLanguage(data) :
      () => updateLanguage(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: LanguageResponse) => {
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
      await this.loadLanguage(id);
    }
  }

  loadLanguage = async (id: number) => {
    this.apiCall(
      () => getLanguage(id),
      (data: Language) => {
        runInAction(() => {
          
          this.name = data.name;
          this.nameKg = data.nameKg;
          this.descriptionKg = data.descriptionKg;
          this.textColor = data.textColor;
          this.backgroundColor = data.backgroundColor;
          this.description = data.description;
          this.code = data.code;
          this.isdefault = data.isdefault;
          this.queuenumber = data.queuenumber;
          this.id = data.id;
        });
      }
    );
  };

  

}

export default new LanguageStore();
