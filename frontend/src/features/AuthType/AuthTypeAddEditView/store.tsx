import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getAuthType, createAuthType, updateAuthType } from "api/AuthType";
import { AuthType, AuthTypeCreateModel } from "constants/AuthType";


interface AuthTypeResponse {
  id: number;
}

class AuthTypeStore extends BaseStore {
  @observable id: number = 0
	@observable description: string = ""
	@observable name: string = ""
	@observable code: string = ""
	

  


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
		this.description = ""
		this.name = ""
		this.code = ""
		
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
    const data: AuthTypeCreateModel = {
      
      id: this.id - 0,
      description: this.description,
      name: this.name,
      code: this.code,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createAuthType(data) :
      () => updateAuthType(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: AuthTypeResponse) => {
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
      await this.loadAuthType(id);
    }
  }

  loadAuthType = async (id: number) => {
    this.apiCall(
      () => getAuthType(id),
      (data: AuthType) => {
        runInAction(() => {
          
          this.id = data.id;
          this.description = data.description;
          this.name = data.name;
          this.code = data.code;
        });
      }
    );
  };

  

}

export default new AuthTypeStore();
