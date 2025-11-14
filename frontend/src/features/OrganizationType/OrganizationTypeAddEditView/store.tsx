import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getOrganizationType, createOrganizationType, updateOrganizationType } from "api/OrganizationType";
import { OrganizationType, OrganizationTypeCreateModel } from "constants/OrganizationType";


interface OrganizationTypeResponse {
  id: number;
}

class OrganizationTypeStore extends BaseStore {
  @observable id: number = 0
	@observable descriptionKg: string = ""
	@observable textColor: string = ""
	@observable backgroundColor: string = ""
	@observable name: string = ""
	@observable description: string = ""
	@observable code: string = ""
	@observable nameKg: string = ""
	

  


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
		this.descriptionKg = ""
		this.textColor = ""
		this.backgroundColor = ""
		this.name = ""
		this.description = ""
		this.code = ""
		this.nameKg = ""
		
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
    const data: OrganizationTypeCreateModel = {
      
      id: this.id - 0,
      descriptionKg: this.descriptionKg,
      textColor: this.textColor,
      backgroundColor: this.backgroundColor,
      name: this.name,
      description: this.description,
      code: this.code,
      nameKg: this.nameKg,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createOrganizationType(data) :
      () => updateOrganizationType(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: OrganizationTypeResponse) => {
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
      await this.loadOrganizationType(id);
    }
  }

  loadOrganizationType = async (id: number) => {
    this.apiCall(
      () => getOrganizationType(id),
      (data: OrganizationType) => {
        runInAction(() => {
          
          this.id = data.id;
          this.descriptionKg = data.descriptionKg;
          this.textColor = data.textColor;
          this.backgroundColor = data.backgroundColor;
          this.name = data.name;
          this.description = data.description;
          this.code = data.code;
          this.nameKg = data.nameKg;
        });
      }
    );
  };

  

}

export default new OrganizationTypeStore();
