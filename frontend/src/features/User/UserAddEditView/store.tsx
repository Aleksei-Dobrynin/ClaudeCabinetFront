import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getUser, createUser, updateUser } from "api/User";
import { User, UserCreateModel } from "constants/User";


interface UserResponse {
  id: number;
}

class UserStore extends BaseStore {
  @observable id: number = 0
  @observable isApproved: boolean = false
  @observable lastName: string = ""
  @observable firstName: string = ""
  @observable secondName: string = ""
  @observable companyId: number = 0
  @observable isDirector: boolean = false
  @observable pin: string = ""





  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
      this.isApproved = false
      this.lastName = ""
      this.firstName = ""
      this.secondName = ""
      this.companyId = 0
      this.isDirector = false
      this.pin = ""

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
    const data: UserCreateModel = {
      id: this.id - 0,
      isApproved: this.isApproved,
      lastName: this.lastName,
      firstName: this.firstName,
      secondName: this.secondName,
      companyId: this.companyId - 0 === 0 ? null : this.companyId - 0,
      isDirector: this.isDirector,
      pin: this.pin,
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }

    // Determine whether to create or update
    const apiMethod = data.id === 0 ?
      () => createUser(data) :
      () => updateUser(data);

    // Make API call with inherited method
    this.apiCall(
      apiMethod,
      (response: UserResponse) => {
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
      await this.loadUser(id);
    }
  }

  loadUser = async (id: number) => {
    this.apiCall(
      () => getUser(id),
      (data: User) => {
        runInAction(() => {

          this.id = data.id;
          this.isApproved = data.isApproved;
          this.lastName = data.lastName;
          this.firstName = data.firstName;
          this.secondName = data.secondName;
          this.isDirector = data.isDirector;
          this.companyId = data.companyId;
          this.pin = data.pin;
        });
      }
    );
  };



}

export default new UserStore();
