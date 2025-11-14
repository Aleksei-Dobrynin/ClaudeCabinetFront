import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { validate, validateField } from "./valid";
import { getArchObject, createArchObject, updateArchObject, getDistricts, getTags } from "api/ArchObject";
import { ArchObject, ArchObjectCreateModel } from "constants/ArchObject";


interface ArchObjectResponse {
  id: number;
}

class ArchObjectStore extends BaseStore {
  @observable id: number = 0
  @observable districtId: number = 0
  @observable applicationId: number = 0
  @observable address: string = ""
  @observable name: string = ""
  @observable identifier: string = ""
  @observable description: string = ""
  @observable tags: number[] = []


  @observable districts = []
  @observable allTags = []


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
      this.districtId = 0
      this.applicationId = 0
      this.address = ""
      this.name = ""
      this.identifier = ""
      this.description = ""
      this.tags = []

    });
  }

  setData(data: ArchObject) {
    if (data) {
      this.id = data.id
      this.name = data.name
      this.address = data.address
      this.applicationId = data.applicationId
      this.description = data.description
      this.identifier = data.identifier
      this.districtId = data.districtId
      this.tags = data.tags
    }
  }

  async validateField(name: string, value: any) {
    const { isValid, error } = await validateField(name, value);
    if (isValid) {
      this.errors[name] = "";
    } else {
      this.errors[name] = error;
    }
  }

  changeTags(ids: number[]) {
    this.tags = ids;
  }

  async onSaveClick(onSaved: (data: any) => void) {
    const data: ArchObjectCreateModel = {

      id: this.id - 0,
      districtId: this.districtId - 0,
      applicationId: this.applicationId - 0,
      address: this.address,
      name: this.name,
      identifier: this.identifier,
      description: this.description,
      tags: this.tags
    };

    const { isValid, errors } = await validate(data);
    if (!isValid) {
      this.errors = errors;
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
      return;
    }
    onSaved(data)

    // Determine whether to create or update
    // const apiMethod = data.id === 0 ?
    //   () => createArchObject(data) :
    //   () => updateArchObject(data);

    // // Make API call with inherited method
    // this.apiCall(
    //   apiMethod,
    //   (response: ArchObjectResponse) => {
    //     if (data.id === 0) {
    //       runInAction(() => {
    //         this.id = response.id;
    //       });
    //       this.showSuccessSnackbar(i18n.t("message:snackbar.successSave"));
    //     } else {
    //       this.showSuccessSnackbar(i18n.t("message:snackbar.successEdit"));
    //     }
    //     onSaved(response.id || this.id);
    //   }
    // );
  };

  async doLoad() {

    // this.loadDistricts()
    this.loadtags();

    // if (id) {
    //   this.id = id;
    //   await this.loadArchObject(id);
    // }
  }

  loadArchObject = async (id: number) => {
    this.apiCall(
      () => getArchObject(id),
      (data: ArchObject) => {
        runInAction(() => {

          this.id = data.id;
          this.districtId = data.districtId;
          this.applicationId = data.applicationId;
          this.address = data.address;
          this.name = data.name;
          this.identifier = data.identifier;
          this.description = data.description;
        });
      }
    );
  };


  loadDistricts = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDistricts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.districts = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadtags = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTags();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.allTags = response.data
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

export default new ArchObjectStore();
