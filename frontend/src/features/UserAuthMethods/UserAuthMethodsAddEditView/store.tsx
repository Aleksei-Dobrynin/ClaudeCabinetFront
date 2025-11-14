import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getUserAuthMethods, createUserAuthMethods, updateUserAuthMethods } from "api/UserAuthMethods";
import { UserAuthMethods, UserAuthMethodsCreateModel } from "constants/UserAuthMethods";

import { getAuthTypes } from "api/AuthType";
    
import { getUsers } from "api/User";
    

interface UserAuthMethodsResponse {
  id: number;
}

class UserAuthMethodsStore extends BaseStore {
  @observable id: number = 0
	@observable authTypeId: number = 0
	@observable userId: number = 0
	@observable authData: string = ""
	

  @observable authTypes = []
	@observable users = []
	


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
		this.authTypeId = 0
		this.userId = 0
		this.authData = ""
		
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
    const data: UserAuthMethodsCreateModel = {
      
      id: this.id - 0,
      authTypeId: this.authTypeId - 0,
      userId: this.userId - 0,
      authData: this.authData,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createUserAuthMethods(data) :
      () => updateUserAuthMethods(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: UserAuthMethodsResponse) => {
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

    await this.loadAuthTypes();
		await this.loadUsers();
		

    if (id) {
      this.id = id;
      await this.loadUserAuthMethods(id);
    }
  }

  loadUserAuthMethods = async (id: number) => {
    this.apiCall(
      () => getUserAuthMethods(id),
      (data: UserAuthMethods) => {
        runInAction(() => {
          
          this.id = data.id;
          this.authTypeId = data.authTypeId;
          this.userId = data.userId;
          this.authData = data.authData;
        });
      }
    );
  };

  
  loadAuthTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getAuthTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.authTypes = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
    
  loadUsers = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getUsers();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.users = response.data
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

export default new UserAuthMethodsStore();
