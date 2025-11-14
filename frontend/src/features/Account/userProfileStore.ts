import { makeObservable, observable, runInAction, action } from "mobx";
import i18n from "i18next";
import BaseStore from "core/stores/BaseStore";
import MainStore from "MainStore";
import { getMyInfo, updateUserInfo, changePassword } from "api/User";
import * as yup from "yup";

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  secondName: string;
  pin: string;
  email: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  guid: string;
  is_connect_telegram: boolean;
}

interface EditFormData {
  firstName: string;
  lastName: string;
  secondName: string;
  pin: string;
}

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class UserProfileStore extends BaseStore {
  @observable userData: UserData = {
    id: 0,
    firstName: "",
    lastName: "",
    secondName: "",
    pin: "",
    email: "",
    isApproved: false,
    createdAt: "",
    updatedAt: "",
    guid: "",
    is_connect_telegram: false
  };

  @observable editFormData: EditFormData = {
    firstName: "",
    lastName: "",
    secondName: "",
    pin: "",
  };

  @observable passwordFormData: PasswordFormData = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  constructor() {
    super();
    makeObservable(this);
  }

  @action
  setEditFormData(data: EditFormData) {
    this.editFormData = data;
    this.errors = {};
  }

  @action
  setPasswordFormData(data: PasswordFormData) {
    this.passwordFormData = data;
    this.errors = {};
  }

  @action
  handleEditFormChange(event: { target: { name: string; value: any } }) {
    const { name, value } = event.target;
    runInAction(() => {
      this.editFormData[name] = value;
      this.validateEditField(name, value);
    });
  }

  @action
  handlePasswordFormChange(event: { target: { name: string; value: any } }) {
    const { name, value } = event.target;
    runInAction(() => {
      this.passwordFormData[name] = value;
      this.validatePasswordField(name, value);
    });
  }

  @action
  async validateEditField(name: string, value: any) {
    try {
      const schema = yup.object().shape({
        lastName: yup.string().required(i18n.t("message:error.fieldRequired")),
        firstName: yup.string().required(i18n.t("message:error.fieldRequired")),
        secondName: yup.string(),
        pin: yup
          .string()
          .required(i18n.t("message:error.fieldRequired"))
          .matches(/^\d+$/, i18n.t("message:error.onlyDigits"))
          .length(14, i18n.t("message:error.pinLength")),
      });

      await schema.validateAt(name, { [name]: value });
      runInAction(() => {
        this.errors[name] = "";
      });
    } catch (error) {
      runInAction(() => {
        this.errors[name] = error.message;
      });
    }
  }

  @action
  async validatePasswordField(name: string, value: any) {
    try {
      const schema = yup.object().shape({
        oldPassword: yup.string().required(i18n.t("message:error.fieldRequired")),
        newPassword: yup
          .string()
          .required(i18n.t("message:error.fieldRequired"))
          .min(8, i18n.t("message:error.passwordMin"))
          .matches(/[a-z]/, i18n.t("message:error.notOneLowercase"))
          .matches(/[A-Z]/, i18n.t("message:error.notOneUppercase"))
          .matches(/\d/, i18n.t("message:error.notOneDigit"))
          .matches(/[^a-zA-Z\d\s]/, i18n.t("message:error.notOneNonAlphanumeric")),
        confirmPassword: yup
          .string()
          .required(i18n.t("message:error.fieldRequired"))
          .oneOf([yup.ref("newPassword")], i18n.t("message:error.passwordMismatch")),
      });

      await schema.validateAt(name, {
        ...this.passwordFormData,
        [name]: value,
      });

      runInAction(() => {
        this.errors[name] = "";
      });
    } catch (error) {
      runInAction(() => {
        this.errors[name] = error.message;
      });
    }
  }

  @action
  async loadUserData() {
    try {
      this.showLoader();
      const response = await getMyInfo();

      if (response?.status === 200) {
        runInAction(() => {
          this.userData = {
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            secondName: response.data.secondName,
            pin: response.data.pin,
            email: response.data.email,
            isApproved: response.data.isApproved,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
            guid: response.data.guid,
            is_connect_telegram: response.data.is_connect_telegram,
          };
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      this.showErrorSnackbar(i18n.t("message:error.loadingUserData"));
    } finally {
      this.hideLoader();
    }
  }

  @action
  async updateUserInfo(onSuccess: () => void) {
    const schema = yup.object().shape({
      lastName: yup.string().required(i18n.t("message:error.fieldRequired")),
      firstName: yup.string().required(i18n.t("message:error.fieldRequired")),
      secondName: yup.string(),
      pin: yup
        .string()
        .required(i18n.t("message:error.fieldRequired"))
        .matches(/^\d+$/, i18n.t("message:error.onlyDigits"))
        .length(14, i18n.t("message:error.pinLength")),
    });

    try {
      await schema.validate(this.editFormData, { abortEarly: false });

      this.showLoader();
      const updateData = {
        id: this.userData.id,
        firstName: this.editFormData.firstName,
        lastName: this.editFormData.lastName,
        secondName: this.editFormData.secondName,
        pin: this.editFormData.pin,
      };

      const response = await updateUserInfo(updateData);

      if (response?.status === 200) {
        runInAction(() => {
          this.userData = {
            ...this.userData,
            firstName: this.editFormData.firstName,
            lastName: this.editFormData.lastName,
            secondName: this.editFormData.secondName,
          };
        });

        this.showSuccessSnackbar(i18n.t("message:ProfileUpdated"));
        if (onSuccess) onSuccess();
      } else {
        throw new Error();
      }
    } catch (err) {
      if (err.inner) {
        const errorObj = {};
        err.inner.forEach((e) => {
          errorObj[e.path] = e.message;
        });

        runInAction(() => {
          this.errors = errorObj;
        });
      } else {
        this.showErrorSnackbar(i18n.t("message:error.updatingUserData"));
      }
    } finally {
      this.hideLoader();
    }
  }

  @action
  async changePassword(onSuccess: () => void) {
    const schema = yup.object().shape({
      oldPassword: yup.string().required(i18n.t("message:error.fieldRequired")),
      newPassword: yup
        .string()
        .required(i18n.t("message:error.fieldRequired"))
        .min(8, i18n.t("message:error.passwordMin"))
        .matches(/[a-z]/, i18n.t("message:error.notOneLowercase"))
        .matches(/[A-Z]/, i18n.t("message:error.notOneUppercase"))
        .matches(/\d/, i18n.t("message:error.notOneDigit"))
        .matches(/[^a-zA-Z\d\s]/, i18n.t("message:error.notOneNonAlphanumeric")),
      confirmPassword: yup
        .string()
        .required(i18n.t("message:error.fieldRequired"))
        .oneOf([yup.ref("newPassword")], i18n.t("message:error.passwordMismatch")),
    });

    try {
      await schema.validate(this.passwordFormData, { abortEarly: false });

      this.showLoader();
      const changePasswordData = {
        id: this.userData.id,
        oldPassword: this.passwordFormData.oldPassword,
        newPassword: this.passwordFormData.newPassword,
      };

      const response = await changePassword(changePasswordData);

      if (response?.status === 200) {
        this.showSuccessSnackbar(i18n.t("message:changedSuccessfully"));
        if (onSuccess) onSuccess();
      } else {
        throw new Error();
      }
    } catch (err) {
      if (err.inner) {
        const errorObj = {};
        err.inner.forEach((e) => {
          errorObj[e.path] = e.message;
        });

        runInAction(() => {
          this.errors = errorObj;
        });
      } else if (err.response && err.response.status === 400) {
        runInAction(() => {
          this.errors.oldPassword = i18n.t("message:error.wrongCurrentPassword");
        });
      } else {
        this.showErrorSnackbar(i18n.t("message:error.changingPassword"));
      }
    } finally {
      this.hideLoader();
    }
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.editFormData = {
        firstName: "",
        lastName: "",
        secondName: "",
        pin: "",
      };

      this.passwordFormData = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    });
  }
}

export default new UserProfileStore();
