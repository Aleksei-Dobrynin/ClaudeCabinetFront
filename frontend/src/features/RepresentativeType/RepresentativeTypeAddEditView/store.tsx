import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getRepresentativeType, createRepresentativeType, updateRepresentativeType } from "api/RepresentativeType";
import { RepresentativeType, RepresentativeTypeCreateModel } from "constants/RepresentativeType";


interface RepresentativeTypeResponse {
  id: number;
}

class RepresentativeTypeStore extends BaseStore {
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
    const data: RepresentativeTypeCreateModel = {
      
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
      () => createRepresentativeType(data) :
      () => updateRepresentativeType(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: RepresentativeTypeResponse) => {
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
      await this.loadRepresentativeType(id);
    }
  }

  loadRepresentativeType = async (id: number) => {
    this.apiCall(
      () => getRepresentativeType(id),
      (data: RepresentativeType) => {
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

export default new RepresentativeTypeStore();
