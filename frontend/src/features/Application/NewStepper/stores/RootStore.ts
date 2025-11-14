// stores/RootStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import { ParticipantsStore } from "./ParticipantsStore";
import { ObjectStore } from "./ObjectStore";
import { DocumentsStore } from "./DocumentsStore";
import { PrintStore } from "./PrintStore";
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
        runInAction(() => {
          this.dogovorTemplate = response.data;
        });
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
        runInAction(() => {
          this.personalDataAgreementText = response.data;
        });
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
        const appData = response.data;

        runInAction(() => {
          this.applicationId = appData.id;
          this.statusId = appData.statusId;
          this.companyId = appData.companyId;
          this.appCabinetUuid = appData.appCabinetUuid;
          this.registrationDate = appData.registrationDate;
          this.deadline = appData.deadline;
          this.number = appData.number;
          this.comment = appData.comment;
        });

        // Load data into sub-stores
        this.objectStore.workType = appData.workDescription || "";
        this.objectStore.selectedServiceId = appData.rServiceId;
        this.objectStore.selectedServiceName = appData.rServiceName || "";

        if (appData.archObjects && appData.archObjects.length > 0) {
          runInAction(() => {
            this.objectStore.objects = appData.archObjects;
          });
        }

        await this.objectStore.reloadDependentData();

        // Load participant data
        this.participantsStore.loadFromApplication(appData);

        // Load documents
        await this.documentsStore.loadUploadedDocuments();
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

  async saveApplication(): Promise<boolean> {
    console.log('💾 saveApplication started');

    if (!this.objectStore.validate()) {
      console.log('❌ Validation failed in saveApplication');
      return false;
    }

    // ⭐⭐⭐ УДАЛИТЕ ЭТИ СТРОКИ ⭐⭐⭐
    // if (!this.participantsStore.validate()) {
    //   console.log('❌ Participants validation failed in saveApplication');
    //   return false;
    // }

    this.isLoading = true;
    console.log('⏳ Loading started');

    try {
      // Save customer first ТОЛЬКО если есть данные участника
      if (this.participantsStore.selectedRole) {
        console.log('👤 Saving customer...');
        const customerSaved = await this.participantsStore.save();
        console.log('👤 Customer save result:', customerSaved);

        if (!customerSaved) {
          console.log('❌ Customer save failed');
          return false;
        }
      } else {
        console.log('⏭️ Skipping customer save - not yet configured');
      }

      // Prepare application data
      console.log('📦 Preparing application data...');
      const data: ApplicationCreateModel = {
        id: this.applicationId,
        workDescription: this.objectStore.workType,
        statusId: this.statusId,
        companyId: this.companyId,
        rServiceId: this.objectStore.selectedServiceId!,
        rServiceName: this.objectStore.selectedServiceName,
        uniqueCode: "",
        registrationDate: this.registrationDate,
        deadline: this.deadline,
        number: this.number,
        comment: this.comment,
        archObjects: this.objectStore.objects,
        appCabinetUuid: this.appCabinetUuid
      };

      console.log('📦 Application data prepared:', JSON.stringify(data, null, 2));

      data.archObjects.forEach(x => {
        x.applicationId = this.applicationId;
        x.address = this.objectStore.getObjectAddress(x); // Добавьте это если нужно
      });

      // Create or update application
      let response;
      if (this.applicationId === 0) {
        console.log('🆕 Creating new application...');
        response = await createApplication(data);
      } else {
        console.log('📝 Updating existing application...');
        response = await updateApplication(data);
      }

      console.log('📡 API Response:', response);

      if ((response?.status === 200 || response?.status === 201) && response.data) {
        runInAction(() => {
          if (this.applicationId === 0) {
            this.applicationId = response.data.id;
            this.appCabinetUuid = response.data.appCabinetUuid;
            console.log('✅ Application created, ID:', this.applicationId);
          } else {
            console.log('✅ Application updated');
          }
        });

        // Link customer to application ТОЛЬКО если есть companyId
        if (this.companyId && this.applicationId) {
          console.log('🔗 Linking customer to application...');
          await setCustomerToApplication(this.applicationId, this.companyId);
        }

        this.showSnackbar(i18n.t("rootStore.success.applicationSaved"), "success");
        console.log('✅ Save completed successfully');
        return true;
      }

      console.log('❌ Invalid response from API');
      this.showSnackbar(i18n.t("rootStore.error.savingApplication"), "error");
      return false;
    } catch (error) {
      console.error('❌ Save error:', error);
      this.showSnackbar(i18n.t("rootStore.error.savingApplication"), "error");
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
        console.log('⏳ Loading finished');
      });
    }
  }

  async nextStep() {
    console.log('🚀 nextStep called, currentStep:', this.currentStep);

    let isValid = false;

    switch (this.currentStep) {
      case 0: // Objects step
        console.log('📝 Validating objects step...');
        isValid = this.objectStore.validate();
        console.log('✅ Validation result:', isValid);

        if (!isValid) {
          console.log('❌ Validation failed, stopping');
          return;
        }
        break;

      case 1: // Participants step
        console.log('📝 Validating participants step...');
        isValid = this.participantsStore.validate();
        console.log('✅ Validation result:', isValid);

        if (!isValid) {
          this.showSnackbar(i18n.t("participants.error.fillRequiredFields"), "error");
          return;
        }
        break;

      case 2: // Documents step
        console.log('📝 Validating documents step...');
        isValid = this.documentsStore.isAllRequiredUploaded;
        console.log('✅ All documents uploaded:', isValid);

        if (!isValid) {
          this.showSnackbar(i18n.t("rootStore.validation.uploadAllDocuments"), "warning");
        }
        // Позволяем перейти дальше даже если не все документы загружены
        break;

      case 3: // Review step
        isValid = true;
        break;

      default:
        isValid = true;
    }

    // Save application before moving to next step
    if (this.currentStep < 3) {
      console.log('💾 Saving application...');
      const saved = await this.saveApplication();
      console.log('💾 Save result:', saved);

      if (!saved) {
        console.log('❌ Save failed, stopping');
        return;
      }
    }

    console.log('✅ Moving to next step');
    runInAction(() => {
      this.currentStep = Math.min(this.currentStep + 1, this.steps.length - 1);
      console.log('📍 New step:', this.currentStep);
    });
  }

  previousStep() {
    runInAction(() => {
      this.currentStep = Math.max(this.currentStep - 1, 0);
    });
  }

  setCurrentStep(step: number) {
    runInAction(() => {
      this.currentStep = step;
    });
  }

  // Alias для обратной совместимости
  setStep(step: number) {
    this.setCurrentStep(step);
  }

  async sendToBga(): Promise<boolean> {
    if (!this.isDigitallySigned) {
      this.showSnackbar(i18n.t("rootStore.validation.signatureRequired"), "warning");
      return false;
    }

    this.isLoading = true;

    try {
      const validateResponse = await validateCheckApplication(this.applicationId);

      if (validateResponse?.status !== 200 && validateResponse?.status !== 201) {
        this.showSnackbar(i18n.t("rootStore.error.validationFailed"), "error");
        return false;
      }

      const response = await sendToBga(this.applicationId, this.dogovorTemplate);

      if ((response?.status === 200 || response?.status === 201) && response.data) {
        runInAction(() => {
          this.applicationNumber = response.data.number || "";
          this.currentStep = this.steps.length - 1; // Go to completion step
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
    runInAction(() => {
      this.currentStep = 0;
      this.applicationId = 0;
      this.applicationStatus = null;
      this.isLoading = false;
      this.isDigitallySigned = false;
      this.digitalSignatureDate = null;
      this.companyId = 0;
      this.appCabinetUuid = "";
      this.applicationNumber = "";
    });
  }

  startNewApplication() {
    this.reset();
    window.history.replaceState(null, "", "/user/stepper?id=0");
    this.showSnackbar(i18n.t("rootStore.success.newApplicationStarted"), "info");
  }

  get canNavigateNext(): boolean {
    return !this.isLoading && this.currentStep < this.steps.length - 1;
  }

  get canNavigateBack(): boolean {
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