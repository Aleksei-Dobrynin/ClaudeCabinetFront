import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getUserContact, createUserContact, updateUserContact } from "api/UserContact";
import { UserContact, UserContactCreateModel } from "constants/UserContact";

import { getUsers } from "api/User";
    

interface UserContactResponse {
  id: number;
}

class UserContactStore extends BaseStore {
  @observable id: number = 0
	@observable rTypeId: number = 0
	@observable rTypeName: string = ""
	@observable value: string = ""
	@observable allowNotification: boolean = false
	@observable customerId: number = 0
	@observable userId: number = 0
	

  @observable users = []
	


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
		this.rTypeId = 0
		this.rTypeName = ""
		this.value = ""
		this.allowNotification = false
		this.customerId = 0
		this.userId = 0
		
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
    const data: UserContactCreateModel = {
      
      id: this.id - 0,
      rTypeId: this.rTypeId - 0,
      rTypeName: this.rTypeName,
      value: this.value,
      allowNotification: this.allowNotification,
      customerId: this.customerId - 0,
      userId: this.userId - 0,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createUserContact(data) :
      () => updateUserContact(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: UserContactResponse) => {
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

    await this.loadUsers();
		

    if (id) {
      this.id = id;
      await this.loadUserContact(id);
    }
  }

  loadUserContact = async (id: number) => {
    this.apiCall(
      () => getUserContact(id),
      (data: UserContact) => {
        runInAction(() => {
          
          this.id = data.id;
          this.rTypeId = data.rTypeId;
          this.rTypeName = data.rTypeName;
          this.value = data.value;
          this.allowNotification = data.allowNotification;
          this.customerId = data.customerId;
          this.userId = data.userId;
        });
      }
    );
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

export default new UserContactStore();
