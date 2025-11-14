// stores/RootStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import { ParticipantsStore } from "./ParticipantsStore";
import { ObjectStore } from "./ObjectStore";
import { DocumentsStore } from "./DocumentsStore";
import { PrintStore } from "./PrintStore";
import ApiService from "../services/ApiService";
import { ApplicationCreateModel } from "constants/Application";
import {
  createApplication,
  getApplication,
  setCustomerToApplication,
  updateApplication,
  sendToBga,
  validateCheckApplication
} from "api/Application";
import { getDogovorTemplate } from "api/Application";
import { getApplicationDataAgreementText } from "api/Auth/register";
import i18n from "i18next";

export type SnackbarSeverity = "success" | "error" | "warning" | "info";

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

export class RootStore {
  currentStep = 0;
  isLoading = false;
  applicationId: number = 0;
  statusId: number = 0;
  statusName: number = 0;
  companyId: number = 0;
  registrationDate = null;
  appCabinetUuid = "";
  deadline = null;
  number = "";
  comment = "";
  applicationStatus: string | null = null;
  applicationNumber: string = "";

  // Digital signature status
  isDigitallySigned: boolean = false;
  digitalSignatureDate: Date | null = null;
  isConsentSign: boolean = false;

  dogovorTemplate: string = "";
  personalDataAgreementText: string = "";
  appNumber: string = "";

  snackbar: SnackbarState = {
    open: false,
    message: "",
    severity: "info",
  };

  steps = [
    i18n.t("steps.objects"),
    i18n.t("steps.applicant"),
    i18n.t("steps.documents"),
    i18n.t("steps.review"),
    i18n.t("steps.completion")
  ];

  // Sub-stores
  objectStore: ObjectStore;
  participantsStore: ParticipantsStore;
  documentsStore: DocumentsStore;
  printStore: PrintStore;

  constructor() {
    makeAutoObservable(this);

    // Initialize sub-stores
    this.objectStore = new ObjectStore(this);
    this.participantsStore = new ParticipantsStore(this);
    this.documentsStore = new DocumentsStore(this);
    this.printStore = new PrintStore(this);
  }

  async initialize(id: number) {
    if (id === 0) {
      // New application
      this.reset();
      this.applicationId = 0;
    } else {
      // Load existing application
      await this.loadApplication(id);
    }
  }

  async loadTemplateDogovor() {
    try {
      const lang = i18n.language.split('-')[0];
      const response = await getDogovorTemplate(this.applicationId, lang);

      if ((response?.status === 200 || response?.status === 201) && response.data) {
        this.dogovorTemplate = response.data;
      }
    } catch (error) {
      console.error("Error loading template:", error);
      this.showSnackbar(i18n.t("rootStore.error.loadingTemplate"), "error");
    }
  }

  async loadPersonalDataAgreementText() {
    try {
      const response = await getApplicationDataAgreementText();

      if ((response?.status === 200 || response?.status === 201) && response.data) {
        this.personalDataAgreementText = response.data;
      }
    } catch (error) {
      console.error("Error loading agreement text:", error);
      this.showSnackbar(i18n.t("rootStore.error.loadingAgreement"), "error");
    }
  }

  async loadApplication(id: number) {
    this.isLoading = true;
    try {
      const response = await getApplication(id);

      if ((response?.status === 200 || response?.status === 201) && response.data) {
        runInAction(() => {
          this.applicationId = response.data.id;
          this.applicationNumber = response.data.number;
          this.applicationStatus = response.data.status;
          this.companyId = response.data.companyId;
          this.appCabinetUuid = response.data.appCabinetUuid;
          this.deadline = response.data.deadline;
          this.registrationDate = response.data.registrationDate;
          this.statusId = response.data.statusId;
          this.statusName = response.data.statusName;

          // Load data into stores
          this.objectStore.loadFromApplication(response.data);
          this.participantsStore.loadFromApplication(response.data);

          this.showSnackbar(i18n.t("rootStore.success.applicationLoaded"), "success");
        });
      } else {
        this.showSnackbar(response.message || i18n.t("rootStore.error.loadingApplication"), "error");
        // Redirect to new application
        window.history.replaceState(null, "", "/user/stepper?id=0");
        this.applicationId = 0;
      }
    } catch (error) {
      console.error("Error loading application:", error);
      this.showSnackbar(i18n.t("rootStore.error.loadingApplication"), "error");
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  setCurrentStep(step: number) {
    if (step >= 0 && step < this.steps.length) {
      this.currentStep = step;
    }
  }

  setDigitalSignature(signed: boolean) {
    this.isDigitallySigned = signed;
    this.digitalSignatureDate = signed ? new Date() : null;

    if (signed) {
      this.showSnackbar(i18n.t("rootStore.success.documentsSignedEDS"), "success");
    }
  }

  async nextStep() {
    // Validate current step before proceeding
    let canProceed = true;

    switch (this.currentStep) {
      case 0: // Objects
        canProceed = this.objectStore.validate();
        if (canProceed) {
          // Save application after first step
          canProceed = await this.saveApplication();
        }
        break;

      case 1: // Participants
        canProceed = await this.participantsStore.save();
        if (canProceed) {
          // Update application with participant data
          canProceed = await this.setCompanyIdToApplication();
        }
        break;

      case 2: // Documents
        // Allow to proceed even if not all documents are uploaded (as draft)
        if (!this.documentsStore.isAllRequiredUploaded) {
          this.showSnackbar(i18n.t("rootStore.warning.notAllDocumentsUploaded"), "warning");
        }
        break;

      case 3: // Review
        // Check if digital signature is required and completed
        if (!this.isDigitallySigned) {
          this.showSnackbar(i18n.t("rootStore.warning.signRequiredFirst"), "warning");
          canProceed = false;
        } else {
          // Finalize application
          await this.finalizeApplication();
        }
        break;
    }

    if (canProceed && this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      window.history.replaceState(
        null,
        "",
        `/user/stepper?id=${this.applicationId}&tab=${this.currentStep}`
      );
      window.scrollTo(0, 0); // Scroll to top when changing steps
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      window.history.replaceState(
        null,
        "",
        `/user/stepper?id=${this.applicationId}&tab=${this.currentStep}`
      );
      window.scrollTo(0, 0);
    }
  }

  setStep(stepIndex: number) {
    if (stepIndex >= 0) {
      this.currentStep = stepIndex;
      window.history.replaceState(
        null,
        "",
        `/user/stepper?id=${this.applicationId}&tab=${this.currentStep}`
      );
      window.scrollTo(0, 0);
    }
  }

  async saveApplication() {
    this.isLoading = true;
    try {
      const data: ApplicationCreateModel = {
        id: this.applicationId - 0,
        workDescription: this.objectStore.workType,
        archObjectId: null,
        statusId: this.statusId - 0,
        companyId: this.companyId - 0 === 0 ? null : this.companyId - 0,
        rServiceId: this.objectStore.selectedServiceId - 0,
        rServiceName: this.objectStore.selectedServiceName,
        uniqueCode: "",
        registrationDate: this.registrationDate,
        deadline: this.deadline,
        number: this.number,
        comment: this.comment,
        archObjects: this.objectStore.objects,
        appCabinetUuid: this.appCabinetUuid,
      };

      this.objectStore.objects.forEach((x) => {
        x.address = this.objectStore.getObjectAddress(x);
      });
      data.archObjects.forEach((x) => {
        x.applicationId = this.applicationId;
      });

      if (this.applicationId === 0) {
        // Create new application
        const response = await createApplication(data);

        if ((response?.status === 200 || response?.status === 201) && response.data) {
          runInAction(() => {
            this.applicationId = response.data.id;
            this.showSnackbar(i18n.t("rootStore.success.applicationCreatedAndSaved"), "success");
          });
          return true;
        }
      } else {
        // Update existing application
        const response = await updateApplication(data);

        if ((response?.status === 200 || response?.status === 201) && response.data) {
          runInAction(() => {
            this.showSnackbar(i18n.t("rootStore.success.applicationSaved"), "success");
          });
          return true;
        }
      }

      return false;
    } catch (error) {
      this.showSnackbar(i18n.t("rootStore.error.savingApplication"), "error");
      console.error("Save application error:", error);
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async setCompanyIdToApplication() {
    this.isLoading = true;
    try {
      const response = await setCustomerToApplication(this.applicationId, this.companyId);

      if (response?.status === 200 || response?.status === 201) {
        return true;
      }

      return false;
    } catch (error) {
      this.showSnackbar(i18n.t("rootStore.error.updatingApplication"), "error");
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async sendToBga() {
    // First check application validity
    const validation = await this.validateApplicationBeforeSend();
    if (!validation.isValid) {
      this.showSnackbar(validation.message || i18n.t("rootStore.error.applicationValidationFailed"));
      return false;
    }

    this.isLoading = true;
    try {
      const response = await sendToBga(this.applicationId, rootStore.dogovorTemplate);

      if ((response?.status === 200 || response?.status === 201) && response.data) {
        runInAction(() => {
          const pattern = /ЗАЯВЛЕНИЕ №<span class="placeholder">(\d+)<\/span>/; //TODO

          const match = rootStore.dogovorTemplate.match(pattern);
          if (match) {
              rootStore.applicationNumber = match[1];
          }

          rootStore.showSnackbar(i18n.t('rootStore.success.applicationSubmitted'), 'success');
          rootStore.nextStep();
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      this.showSnackbar(i18n.t("rootStore.error.loadingApplication"), "error");
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
      return true;
    }
  }

  async validateApplicationBeforeSend(): Promise<{ isValid: boolean; message?: string }> {
    let validationResult = { isValid: true, message: "" };

    this.isLoading = true;
    try {
      const response = await validateCheckApplication(this.applicationId);

      if ((response?.status === 200 || response?.status === 201) && response.data) {
        runInAction(() => {
          validationResult.isValid = true;
        });
      } else {
        validationResult = {
          isValid: false,
          message: response?.data?.message || i18n.t("rootStore.error.applicationValidationFailed"),
        };
      }
    } catch (error) {
      // Error handled in finally block
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
    return validationResult;
  }

  async finalizeApplication() {
    if (this.applicationId === 0) return false;

    this.isLoading = true;
    try {
      const data = {
        status: "submitted",
        digitalSignatureDate: this.digitalSignatureDate,
        isDigitallySigned: this.isDigitallySigned
      };

      const result = await ApiService.updateApplication(this.applicationId, data);

      if (result.success) {
        runInAction(() => {
          this.applicationStatus = "submitted";
          this.showSnackbar(i18n.t("rootStore.success.applicationSubmitted"), "success");
        });
        return true;
      }

      return false;
    } catch (error) {
      this.showSnackbar(i18n.t("rootStore.error.submittingApplication"), "error");
      console.error("Finalize application error:", error);
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  showSnackbar(message: string, severity: SnackbarSeverity = "info") {
    this.snackbar = {
      open: true,
      message,
      severity,
    };
  }

  closeSnackbar() {
    this.snackbar.open = false;
  }

  reset() {
    // Reset all sub-stores
    this.objectStore.reset();
    this.participantsStore.reset();
    this.documentsStore.reset();
    this.printStore.reset();

    // Reset root store state
    this.currentStep = 0;
    this.applicationId = 0;
    this.applicationStatus = null;
    this.isLoading = false;
    this.isDigitallySigned = false;
    this.digitalSignatureDate = null;
  }

  startNewApplication() {
    this.reset();
    window.history.replaceState(null, "", "/user/stepper?id=0");
    this.showSnackbar(i18n.t("rootStore.success.newApplicationStarted"), "info");
  }

  get canNavigateNext(): boolean {
    // Disable next button during loading or on last step
    return !this.isLoading && this.currentStep < this.steps.length - 1;
  }

  get canNavigateBack(): boolean {
    // Disable back button during loading or on first step
    return !this.isLoading && this.currentStep > 0;
  }

  get isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

  get isReviewStep(): boolean {
    return this.currentStep === 3;
  }

  get isPrintStep(): boolean {
    return this.currentStep === 4;
  }

  get isReadyToSubmit(): boolean {
    return (
      this.participantsStore.selectedRole &&
      this.participantsStore.customerData.pin &&
      this.participantsStore.customerData.name &&
      this.participantsStore.customerData.email &&
      this.participantsStore.customerData.phone1 &&
      this.objectStore.selectedServiceId &&
      this.objectStore.workType &&
      this.objectStore.objects.length > 0 &&
      this.documentsStore.isAllRequiredUploaded &&
      this.isDigitallySigned
    );
  }
}

// Create singleton instance
export const rootStore = new RootStore();

// For debugging in development
if (process.env.NODE_ENV === "development") {
  (window as any).rootStore = rootStore;
}