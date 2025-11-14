import { makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import http from "api/https";
import BaseStore from "core/stores/BaseStore";
import { checkInnExists, getPersonalDataAgreementText, getTundukCompanyInfo, registerCompany } from "api/Auth/register";

// Types for registration data
export interface CompanyRegistrationData {
  inn: string;
  companyName: string;
  email: string;
  // Array of file objects for upload
  confirmationFiles?: File[];
}

// Response format from Tunduk API (as expected)
export interface TundukCompanyInfo {
  companyName: string;
  legalAddress: string;
  registrationDate: string;
  registrationNumber: string;
  // Additional fields that might come from Tunduk
}

class CompanyRegistrationStore extends BaseStore {
  // Form fields
  @observable inn: string = "";
  @observable pinUser: string = "";
  @observable companyName: string = "";
  @observable email: string = "";
  @observable phone: string = "";
  @observable id_registration_type: number = 0;
  @observable code_registration_type: string = "";
  @observable confirmationFiles: File[] = [];
  @observable lastName: string = "";
  @observable firstName: string = "";
  @observable secondName: string = "";

  // Error fields
  @observable innError: string = "";
  @observable companyNameError: string = "";
  @observable emailError: string = "";
  @observable phoneError: string = "";
  @observable filesError: string = "";
  @observable lastNameError: string = "";
  @observable firstNameError: string = "";
  @observable secondNameError: string = "";
  @observable personalDataAgreementRu: string = "";
  @observable personalDataAgreementKg: string = "";
  @observable isAgreementAccepted: boolean = false;
  @observable authMethod: 'sms' | 'email' = 'email';
  @observable isDigitalSignConfirmed: boolean = false;
  @observable companyInfo: TundukCompanyInfo | null = null;

  constructor() {
    super();
    makeObservable(this);
  }

  // Reset all store data
  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.inn = "";
      this.pinUser = "";
      this.companyName = "";
      this.email = "";
      this.phone = "";
      this.authMethod = 'email';
      this.confirmationFiles = [];
      this.clearErrors();
      this.isDigitalSignConfirmed = false;
      this.companyInfo = null;
      this.lastName = "";
      this.firstName = "";
      this.secondName = "";
      this.isAgreementAccepted = false;
    });
  }

  // Clear errors
  clearErrors() {
    runInAction(() => {
      this.innError = "";
      this.companyNameError = "";
      this.emailError = "";
      this.filesError = "";
      this.lastNameError = "";
      this.firstNameError = "";
      this.secondNameError = "";
    });
  }

  toggleAgreement(value: boolean) {
    this.isAgreementAccepted = value;
  }

  // Add files to the store
  addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    
    runInAction(() => {
      // Convert FileList to array and add to existing files
      const newFiles = Array.from(files);
      this.confirmationFiles = [...this.confirmationFiles, ...newFiles];
      this.filesError = ""; // Clear any error when files are added
    });
  }

  // Remove a file from the store
  removeFile(index: number) {
    runInAction(() => {
      this.confirmationFiles = this.confirmationFiles.filter((_, i) => i !== index);
    });
  }

  setAuthMethod(value: 'sms' | 'email') {
    this.authMethod = value;
  }

  formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');

    let local = digits.startsWith('996') ? digits.slice(3) : digits;

    local = local.slice(0, 9);

    let formatted = '';
    if (local.length > 0) formatted += local.slice(0, 3);             // код
    if (local.length > 3) formatted += '-' + local.slice(3, 5);       // первая часть
    if (local.length > 5) formatted += '-' + local.slice(5, 7);       // вторая часть
    if (local.length > 7) formatted += '-' + local.slice(7);          // третья часть

    return `+996 ${formatted}`.trim();
  };

  // Check if INN exists in the system
  checkInnExistsBack = async (): Promise<boolean> => {
    try {
      this.showLoader();

      // Call API to check if INN exists
      const response = await checkInnExists(this.inn);

      if (response?.status === 200) {
        // If INN exists
        if (response.data.exists) {
          runInAction(() => {
            this.innError = i18n.t("label:registration.innAlreadyExists");
          });
          return true;
        } else {
          runInAction(() => {
            this.innError = "";
          });
          return false;
        }
      } else {
        throw new Error("Failed to check INN");
      }
    } catch (error) {
      this.showErrorSnackbar(i18n.t("message:error.innCheckFailed"));
      return false;
    } finally {
      this.hideLoader();
    }
  };

  getAgreementText = async (): Promise<boolean> => {
    this.showLoader();

    try {
      const response = await getPersonalDataAgreementText();

      if (response?.status === 200 && response.data) {
        runInAction(() => {
          this.personalDataAgreementRu = response.data.content_ru || "";
          this.personalDataAgreementKg = response.data.content_kg || "";
        });
        return true;
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      this.showErrorSnackbar(i18n.t("message:error.loadingAgreementText"));
      return false;
    } finally {
      this.hideLoader();
    }
  };

  // Get company information from Tunduk API
  fetchCompanyInfoFromTunduk = async (): Promise<boolean> => {
    try {
      this.showLoader();

      // Call Tunduk API through our backend
      const response = await getTundukCompanyInfo(this.inn);

      if (response?.status === 200 && response.data) {
        runInAction(() => {
          this.companyInfo = response.data;
          // Pre-fill company name from Tunduk data
          this.companyName = response.data.companyName || "";
        });
        return true;
      } else {
        throw new Error("Failed to get company information");
      }
    } catch (error) {
      this.showErrorSnackbar(i18n.t("message:error.tundukFetchFailed"));
      return false;
    } finally {
      this.hideLoader();
    }
  };

  detectInnType(inn: string): string {
    if (inn.startsWith('1') || inn.startsWith('2')) return 'person';
    return 'company';
  }

  // Validate INN format
  validateInn = (): boolean => {
    const cleanInn = this.inn.replace(/\D/g, "");

    if (cleanInn.length !== 14) {
      runInAction(() => {
        this.innError = i18n.t("label:registration.innValidationError");
      });
      return false;
    }

    runInAction(() => {
      this.innError = "";
    });
    return true;
  };

  // Validate email format
  validateEmail = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.email || !emailRegex.test(this.email)) {
      runInAction(() => {
        this.emailError = i18n.t("label:registration.emailValidationError");
      });
      return false;
    }

    runInAction(() => {
      this.emailError = "";
    });
    return true;
  };

  // Validate company name
  validateCompanyName = (): boolean => {
    return true;
    if (!this.companyName || this.companyName.trim() === "") {
      runInAction(() => {
        this.companyNameError = i18n.t("label:registration.companyNameValidationError");
      });
      return false;
    }

    runInAction(() => {
      this.companyNameError = "";
    });
    return true;
  };

  // Validate files
  validateFiles = (): boolean => {
    if (this.confirmationFiles.length === 0) {
      runInAction(() => {
        this.filesError = i18n.t("label:registration.filesRequired");
      });
      return false;
    }

    runInAction(() => {
      this.filesError = "";
    });
    return true;
  };

  // Validate all form fields
  validateAll = (): boolean => {
    const isEmailValid = this.validateEmail();
    const isCompanyNameValid = this.validateCompanyName();
    // const areFilesValid = this.validateFiles();

    return isEmailValid && isCompanyNameValid
  };

  // Open digital signature dialog
  confirmDigitalSignature = (onSubmitSignature : () => void) => {
    MainStore.changeCurrentuserPin(this.inn);
    
    MainStore.openDigitalSign(
      [],
      0,
      async (pin: string) => {
        this.pinUser = pin;
        MainStore.changeCurrentuserPin(""); 
        MainStore.onCloseDigitalSign();
        onSubmitSignature();
      },
      () => {
        MainStore.changeCurrentuserPin(""); 
        MainStore.onCloseDigitalSign();
      },
    );
  };

  // Register company
  registerCompany = async (): Promise<boolean> => {
    // Final validation
    if (!this.validateAll()) {
      return false;
    }

    try {
      this.showLoader();

      // Create FormData object to send files
      const formData = new FormData();
      formData.append("inn", this.inn);
      formData.append("pinUser", this.pinUser);
      formData.append("companyName", this.companyName);
      formData.append("email", this.email);
      formData.append("phone", this.phone);
      formData.append("authMethod", this.authMethod);
      formData.append("regType", this.code_registration_type);
      if (this.code_registration_type !== "company") {
        formData.append("lastName", this.lastName);
        formData.append("firstName", this.firstName);
        formData.append("secondName", this.secondName);
      }

      // Add all confirmation files to FormData
      this.confirmationFiles.forEach((file, index) => {
        formData.append(`confirmationFiles`, file);
      });

      // Call API to register company (using FormData)
      const response = await http.post("/api/v1/Customer/Register", formData, {
        "Content-Type": "multipart/form-data"
      });

      if (response?.status === 200 || response?.status === 201) {
        this.showSuccessSnackbar(i18n.t("message:registration.successfullyCompleted"));
        return true;
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      this.showErrorSnackbar(i18n.t("message:error.registrationFailed"));
      return false;
    } finally {
      this.hideLoader();
    }
  };
}

export default new CompanyRegistrationStore();