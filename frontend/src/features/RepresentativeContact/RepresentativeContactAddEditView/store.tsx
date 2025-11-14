import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getRepresentativeContact, createRepresentativeContact, updateRepresentativeContact } from "api/RepresentativeContact";
import { RepresentativeContact, RepresentativeContactCreateModel } from "constants/RepresentativeContact";

import { getRepresentatives } from "api/Representative";
    

interface RepresentativeContactResponse {
  id: number;
}

class RepresentativeContactStore extends BaseStore {
  @observable id: number = 0
	@observable value: string = ""
	@observable allowNotification: boolean = false
	@observable rTypeId: number = 0
	@observable representativeId: number = 0
	

  @observable representatives = []
	


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
		this.value = ""
		this.allowNotification = false
		this.rTypeId = 0
		this.representativeId = 0
		
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
    const data: RepresentativeContactCreateModel = {
      
      id: this.id - 0,
      value: this.value,
      allowNotification: this.allowNotification,
      rTypeId: this.rTypeId - 0,
      representativeId: this.representativeId - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createRepresentativeContact(data) :
      () => updateRepresentativeContact(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: RepresentativeContactResponse) => {
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

    await this.loadRepresentatives();
		

    if (id) {
      this.id = id;
      await this.loadRepresentativeContact(id);
    }
  }

  loadRepresentativeContact = async (id: number) => {
    this.apiCall(
      () => getRepresentativeContact(id),
      (data: RepresentativeContact) => {
        runInAction(() => {
          
          this.id = data.id;
          this.value = data.value;
          this.allowNotification = data.allowNotification;
          this.rTypeId = data.rTypeId;
          this.representativeId = data.representativeId;
        });
      }
    );
  };

  
  loadRepresentatives = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getRepresentatives();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.representatives = response.data
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

export default new RepresentativeContactStore();
