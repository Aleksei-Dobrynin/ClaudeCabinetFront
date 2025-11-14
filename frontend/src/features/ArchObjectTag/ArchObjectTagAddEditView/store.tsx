import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getArchObjectTag, createArchObjectTag, updateArchObjectTag } from "api/ArchObjectTag";
import { ArchObjectTag, ArchObjectTagCreateModel } from "constants/ArchObjectTag";

import { getArchObjects } from "api/ArchObject";
    

interface ArchObjectTagResponse {
  id: number;
}

class ArchObjectTagStore extends BaseStore {
  @observable id: number = 0
	@observable idObject: number = 0
	@observable rTagId: number = 0
	

  @observable archObjects = []
	


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
		this.idObject = 0
		this.rTagId = 0
		
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
    const data: ArchObjectTagCreateModel = {
      
      id: this.id - 0,
      idObject: this.idObject - 0,
      rTagId: this.rTagId - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createArchObjectTag(data) :
      () => updateArchObjectTag(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: ArchObjectTagResponse) => {
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

    await this.loadArchObjects();
		

    if (id) {
      this.id = id;
      await this.loadArchObjectTag(id);
    }
  }

  loadArchObjectTag = async (id: number) => {
    this.apiCall(
      () => getArchObjectTag(id),
      (data: ArchObjectTag) => {
        runInAction(() => {
          
          this.id = data.id;
          this.idObject = data.idObject;
          this.rTagId = data.rTagId;
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
    

}

export default new ArchObjectTagStore();
