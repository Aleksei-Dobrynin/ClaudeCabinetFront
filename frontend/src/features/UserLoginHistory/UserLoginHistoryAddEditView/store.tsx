import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getUserLoginHistory, createUserLoginHistory, updateUserLoginHistory } from "api/UserLoginHistory";
import { UserLoginHistory, UserLoginHistoryCreateModel } from "constants/UserLoginHistory";

import { getAuthTypes } from "api/AuthType";
    
import { getUsers } from "api/User";
    

interface UserLoginHistoryResponse {
  id: number;
}

class UserLoginHistoryStore extends BaseStore {
  @observable startTime: Dayjs = null
	@observable endTime: Dayjs = null
	@observable authTypeId: number = 0
	@observable userId: number = 0
	@observable id: number = 0
	@observable ipAddress: string = ""
	@observable device: string = ""
	@observable browser: string = ""
	@observable os: string = ""
	

  @observable authTypes = []
	@observable users = []
	


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.startTime = null
		this.endTime = null
		this.authTypeId = 0
		this.userId = 0
		this.id = 0
		this.ipAddress = ""
		this.device = ""
		this.browser = ""
		this.os = ""
		
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
    const data: UserLoginHistoryCreateModel = {
      
      startTime: this.startTime,
      endTime: this.endTime,
      authTypeId: this.authTypeId - 0,
      userId: this.userId - 0,
      id: this.id - 0,
      ipAddress: this.ipAddress,
      device: this.device,
      browser: this.browser,
      os: this.os,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createUserLoginHistory(data) :
      () => updateUserLoginHistory(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: UserLoginHistoryResponse) => {
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
      await this.loadUserLoginHistory(id);
    }
  }

  loadUserLoginHistory = async (id: number) => {
    this.apiCall(
      () => getUserLoginHistory(id),
      (data: UserLoginHistory) => {
        runInAction(() => {
          
          this.startTime = dayjs(data.startTime);
          this.endTime = dayjs(data.endTime);
          this.authTypeId = data.authTypeId;
          this.userId = data.userId;
          this.id = data.id;
          this.ipAddress = data.ipAddress;
          this.device = data.device;
          this.browser = data.browser;
          this.os = data.os;
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

export default new UserLoginHistoryStore();
