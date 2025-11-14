import { makeAutoObservable, runInAction } from 'mobx';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { API_KEY_2GIS } from 'constants/config';
import i18n from 'i18next';
import BaseStore from 'core/stores/BaseStore';
import { 
  getApplication, 
  createApplication, 
  updateApplication, 
  setCustomerToApplication, 
  sendToBga,
  validateCheckApplication 
} from 'api/Application';
import { getServices } from 'api/Service';
import { getTags } from 'api/ArchObject';
import { APPLICATION_CABINET_STATUSES } from 'constants/constant';
import MainStore from 'MainStore';
import { rootStore } from './RootStore';

export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

export interface ArchObject {
  id: number;
  districtId?: number;
  address: string;
  name: string;
  identifier: string;
  description: string;
  applicationId: number;
  tags?: number[];
  geometry?: any;
  addressInfo?: any;
  point?: any;
  DarekSearchList: [];
  xCoord?: number;
  yCoord?: number;
}

export interface ApplicationCreateModel {
  id: number;
  workDescription: string;
  archObjectId?: number;
  statusId: number;
  companyId?: number;
  rServiceId: number;
  rServiceName: string;
  uniqueCode: string;
  registrationDate?: Dayjs;
  lastUpdatedStatus?: Dayjs;
  deadline?: Dayjs;
  number: string;
  comment: string;
  archObjects?: ArchObject[];
  appCabinetUuid?: string;
}

export interface ParticipantData {
  inn: string;
  name: string;
  type: 'individual' | 'legal';
  phone: string;
  email: string;
  address: string;
}

export interface Document {
  id: number;
  name: string;
  required: boolean;
  description: string;
  status: 'uploaded' | 'from-archive' | 'not-uploaded';
  file: File | null;
  uploadedFile: {
    id: string;
    name: string;
    size: number;
    uploadDate: string;
  } | null;
}

export class NewStepperStore extends BaseStore {
  // Application data
  id: number = 0;
  workDescription: string = '';
  archObjectId: number = 0;
  statusId: number = 0;
  statusCode: string = '';
  companyId: number = 0;
  rServiceId: number = 0;
  rServiceName: string = '';
  uniqueCode: string = '';
  registrationDate: Dayjs | null = null;
  lastUpdatedStatus: Dayjs | null = null;
  deadline: Dayjs | null = null;
  number: string = '';
  comment: string = '';
  rejectHtml: string = '';
  rejectFileId: number = 0;
  appCabinetUuid: string = '';

  // Stepper state
  currentStep: number = 0;
  changed: boolean = false;
  isLoading: boolean = false;
  
  // Steps
  steps = [
    i18n.t("stepper.steps.object"),
    i18n.t("stepper.steps.participants"),
    i18n.t("stepper.steps.documents"),
    i18n.t("stepper.steps.review"),
    // i18n.t("stepper.steps.print")
  ];

  // Snackbar
  snackbar: SnackbarState = {
    open: false,
    message: '',
    severity: 'info'
  };

  // Data arrays
  archObjects: ArchObject[] = [];
  services: any[] = [];
  allTags: any[] = [];
  
  // Participants data
  selectedRoles = new Set(['applicant']);
  applicantType: 'individual' | 'legal' = 'individual';
  applicantData: ParticipantData = {
    inn: '',
    name: '',
    type: 'individual',
    phone: '',
    email: '',
    address: ''
  };
  sameAsApplicant: boolean = false;
  
  // Documents data
  documents: Document[] = [];
  uploadProgress: Record<number, number> = {};
  uploadErrors: Record<number, string> = {};

  constructor() {
    super();
  }

  showSnackbar(message: string, severity: SnackbarSeverity = 'info') {
    this.snackbar = { 
      open: true, 
      message, 
      severity 
    };
  }

  closeSnackbar() {
    this.snackbar.open = false;
  }

  setCurrentStep(step: number, resetChanged: boolean = false) {
    runInAction(() => {
      this.currentStep = step;
      if (resetChanged) {
        this.changed = false;
      }
    });
  }

  handleChange(event: { target: { name: string; value: any; }; }): void {
    super.handleChange(event);
    this.changed = true;
    
    if (event.target.name === "rServiceId") {
      const serviceName = this.services.find(x => x.id === this.rServiceId)?.name;
      if (serviceName) {
        this.rServiceName = serviceName;
      }
    }
  }

  handleArchObjectChange(event: { target: { name: string; value: any; }; }, index: number): void {
    if (this.archObjects[index]) {
      (this.archObjects[index] as any)[event.target.name] = event.target.value;
      this.changed = true;
    }
  }

  async handleCoordinatesChange(event: { target: { name: string; value: any; }; }, index: number) {
    if (!this.archObjects[index]) return;
    
    (this.archObjects[index] as any)[event.target.name] = event.target.value;
    this.changed = true;
    
    const xCoord = this.archObjects[index].xCoord;
    const yCoord = this.archObjects[index].yCoord;
    
    if (!isNaN(Number(xCoord)) && !isNaN(Number(yCoord))) {
      try {
        const response = await axios.get('https://catalog.api.2gis.com/3.0/items/geocode', {
          params: {
            lat: xCoord,
            lon: yCoord,
            fields: "items.point,items.address_name",
            key: API_KEY_2GIS,
          },
        });

        const results = response.data.result.items || [];
        if (results?.length > 0) {
          runInAction(() => {
            this.archObjects[index].address = results[0].address_name || results[0].name || "";
            this.archObjects[index].point = [Number(xCoord), Number(yCoord)];
          });
        }
      } catch (error) {
        console.error(i18n.t("stepper.error.addressSearchError"), error);
      }
    }
  }

  addAddress() {
    const newAddress: ArchObject = {
      id: (this.archObjects.length + 1) * -1,
      name: '',
      address: '',
      identifier: '',
      description: '',
      applicationId: this.id,
      xCoord: 0,
      yCoord: 0,
      tags: [],
      geometry: [],
      addressInfo: [],
      point: [],
      DarekSearchList: [],
      districtId: 0
    };
    
    runInAction(() => {
      this.archObjects.push(newAddress);
      this.changed = true;
    });
  }

  removeAddress(index: number) {
    if (index > 0) { // Don't allow removing the first address
      runInAction(() => {
        this.archObjects.splice(index, 1);
        this.changed = true;
      });
    }
  }

  updateParticipantData(field: keyof ParticipantData, value: any) {
    runInAction(() => {
      (this.applicantData as any)[field] = value;
      this.changed = true;
      
      // Clear error when user starts typing
      if (this.errors[field]) {
        delete this.errors[field];
      }
    });
  }

  toggleRole(role: string) {
    runInAction(() => {
      if (this.selectedRoles.has(role)) {
        this.selectedRoles.delete(role);
      } else {
        this.selectedRoles.add(role);
      }
      this.changed = true;
    });
  }

  async uploadDocument(documentId: number, file: File) {
    const doc = this.documents.find(d => d.id === documentId);
    if (!doc) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    if (file.size > maxSize) {
      this.uploadErrors[documentId] = i18n.t("stepper.error.fileTooLarge");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      this.uploadErrors[documentId] = i18n.t("stepper.error.unsupportedFormat");
      return;
    }

    delete this.uploadErrors[documentId];
    this.uploadProgress[documentId] = 0;

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      runInAction(() => {
        if (this.uploadProgress[documentId] < 90) {
          this.uploadProgress[documentId] += 10;
        }
      });
    }, 200);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      
      runInAction(() => {
        doc.status = 'uploaded';
        doc.file = file;
        doc.uploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          uploadDate: new Date().toISOString()
        };
        this.uploadProgress[documentId] = 100;
        this.changed = true;
        
        setTimeout(() => {
          delete this.uploadProgress[documentId];
        }, 1000);
      });
      
      this.showSnackbar(i18n.t("stepper.success.documentUploaded"), 'success');
    } catch (error) {
      clearInterval(progressInterval);
      runInAction(() => {
        delete this.uploadProgress[documentId];
        this.uploadErrors[documentId] = i18n.t("stepper.error.uploadError");
      });
      this.showSnackbar(i18n.t("stepper.error.uploadError"), 'error');
    }
  }

  async validateCurrentStep(): Promise<{isValid: boolean, message?: string}> {
    switch (this.currentStep) {
      case 0: // Object step
        if (!this.rServiceId) {
          return { isValid: false, message: i18n.t("stepper.validation.selectService") };
        }
        if (!this.workDescription) {
          return { isValid: false, message: i18n.t("stepper.validation.enterWorkDescription") };
        }
        if (this.archObjects.length === 0 || !this.archObjects[0].address) {
          return { isValid: false, message: i18n.t("stepper.validation.addObjectAddress") };
        }
        return { isValid: true };
        
      case 1: // Participants step
        if (!this.applicantData.inn || this.applicantData.inn.length !== 14) {
          return { isValid: false, message: i18n.t("stepper.validation.enterCorrectINN") };
        }
        if (!this.applicantData.name) {
          return { isValid: false, message: i18n.t("stepper.validation.enterName") };
        }
        if (!this.applicantData.phone) {
          return { isValid: false, message: i18n.t("stepper.validation.enterPhone") };
        }
        if (!this.applicantData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.applicantData.email)) {
          return { isValid: false, message: i18n.t("stepper.validation.enterCorrectEmail") };
        }
        return { isValid: true };
        
      case 2: // Documents step
        const requiredDocs = this.documents.filter(d => d.required && d.status === 'not-uploaded');
        if (requiredDocs.length > 0) {
          return { isValid: false, message: i18n.t("stepper.validation.uploadRequiredDocuments") };
        }
        return { isValid: true };
        
      default:
        return { isValid: true };
    }
  }

  async saveApplication(navigate?: (url: string) => void) {
    const data: ApplicationCreateModel = {
      id: this.id,
      workDescription: this.workDescription,
      archObjectId: this.archObjectId || undefined,
      statusId: this.statusId,
      companyId: this.companyId || undefined,
      rServiceId: this.rServiceId,
      lastUpdatedStatus: this.lastUpdatedStatus,
      rServiceName: this.rServiceName,
      uniqueCode: this.uniqueCode,
      registrationDate: this.registrationDate,
      deadline: this.deadline,
      number: this.number,
      comment: this.comment,
      archObjects: this.archObjects.map(obj => ({
        ...obj,
        applicationId: this.id
      }))
    };

    const apiMethod = data.id === 0 ? 
      () => createApplication(data) : 
      () => updateApplication(data);

    this.apiCall(
      apiMethod,
      (response: any) => {
        runInAction(() => {
          if (data.id === 0) {
            this.id = response.id;
          }
          this.changed = false;
        });
        
        this.showSnackbar(
          data.id === 0 ? i18n.t("stepper.success.applicationCreated") : i18n.t("stepper.success.applicationSaved"),
          'success'
        );
        
        if (navigate) {
          const nextStep = this.currentStep + 1;
          this.setCurrentStep(nextStep);
          navigate(`/user/Stepper?id=${this.id}&tab=${nextStep}`);
        }
      }
    );
  }

  async submitApplication(navigate: (url: string) => void) {
    if (this.id === 0) {
      this.showSnackbar(i18n.t("stepper.error.saveFirstApplication"), 'error');
      return;
    }

    const validation = await this.validateApplicationBeforeSend();
    if (!validation.isValid) {
      this.showSnackbar(validation.message || i18n.t("stepper.error.validationFailed"), 'error');
      return;
    }

    this.apiCall(
      () => sendToBga(this.id, rootStore.dogovorTemplate),
      () => {
        this.showSnackbar(i18n.t("stepper.success.applicationSubmitted"), 'success');
        navigate('/user/ApplicationAll');
      }
    );
  }

  async validateApplicationBeforeSend(): Promise<{isValid: boolean, message?: string}> {
    let validationResult = { isValid: true, message: "" };
    
    await this.apiCall(
      () => validateCheckApplication(this.id),
      () => {
        validationResult.isValid = true;
      },
      (error) => {
        validationResult = { 
          isValid: false, 
          message: error?.response?.data?.message || i18n.t("stepper.error.applicationValidationFailed")
        };
      }
    );
    
    return validationResult;
  }

  async doLoad(id: number) {
    this.isLoading = true;
    
    try {
      // Load reference data
      await Promise.all([
        this.loadServices(),
        this.loadTags()
      ]);
      
      if (id > 0) {
        this.id = id;
        // await this.loadApplication(id);
      } else {
        // Initialize empty application
        runInAction(() => {
          this.archObjects = [{
            id: -1,
            name: '',
            address: '',
            identifier: '',
            description: '',
            applicationId: 0,
            xCoord: 0,
            yCoord: 0,
            tags: [],
            geometry: [],
            addressInfo: [],
            point: [],
            DarekSearchList: [],
            districtId: 0
          }];
          
          // Initialize mock documents
          this.documents = [
            { 
              id: 1, 
              name: i18n.t("documents.mockData.applicantPassport"), 
              required: true, 
              description: i18n.t("documents.mockData.passportCopy"),
              status: 'not-uploaded',
              file: null,
              uploadedFile: null
            },
            { 
              id: 2, 
              name: i18n.t("documents.mockData.technicalPassport"), 
              required: true, 
              description: i18n.t("documents.mockData.objectTechnicalPassport"),
              status: 'not-uploaded',
              file: null,
              uploadedFile: null
            },
            { 
              id: 3, 
              name: i18n.t("documents.mockData.additionalDocuments"), 
              required: false, 
              description: i18n.t("documents.mockData.otherDocuments"),
              status: 'not-uploaded',
              file: null,
              uploadedFile: null
            }
          ];
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.showSnackbar(i18n.t("stepper.error.loadingData"), 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadServices() {
    try {
      const result = await getServices();
      if (result && result.status === 200 && result.data) {
        runInAction(() => {
          this.services = result.data;
        });
      }
    } catch (error) {
      console.error('Error loading services:', error);
      // Fallback mock data for services if API fails
      runInAction(() => {
        this.services = [
          { id: 1, name: i18n.t("services.mockData.apzService"), day_count: 30 },
          { id: 2, name: i18n.t("services.mockData.projectApproval"), day_count: 45 },
          { id: 3, name: i18n.t("services.mockData.buildingPermit"), day_count: 15 },
          { id: 4, name: i18n.t("services.mockData.technicalConditions"), day_count: 20 },
          { id: 5, name: i18n.t("services.mockData.commissioningAct"), day_count: 10 }
        ];
      });
    }
  }

  async loadTags() {
    try {
      const result = await getTags();
      if (result && result.status === 200 && result.data) {
        runInAction(() => {
          this.allTags = result.data;
        });
      }
    } catch (error) {
      console.error('Error loading tags:', error);
      // Fallback mock data for tags if API fails
      runInAction(() => {
        this.allTags = [
          { id: 1, name: i18n.t("tags.mockData.residential") },
          { id: 2, name: i18n.t("tags.mockData.commercial") },
          { id: 3, name: i18n.t("tags.mockData.industrial") },
          { id: 4, name: i18n.t("tags.mockData.social") },
          { id: 5, name: i18n.t("tags.mockData.newConstruction") },
          { id: 6, name: i18n.t("tags.mockData.reconstruction") },
          { id: 7, name: i18n.t("tags.mockData.replanning") }
        ];
      });
    }
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0;
      this.workDescription = '';
      this.archObjectId = 0;
      this.statusId = 0;
      this.statusCode = '';
      this.companyId = 0;
      this.rServiceId = 0;
      this.rServiceName = '';
      this.uniqueCode = '';
      this.registrationDate = null;
      this.deadline = null;
      this.number = '';
      this.comment = '';
      this.currentStep = 0;
      this.changed = false;
      this.archObjects = [];
      this.services = [];
      this.allTags = [];
      this.selectedRoles = new Set(['applicant']);
      this.applicantType = 'individual';
      this.applicantData = {
        inn: '',
        name: '',
        type: 'individual',
        phone: '',
        email: '',
        address: ''
      };
      this.sameAsApplicant = false;
      this.documents = [];
      this.uploadProgress = {};
      this.uploadErrors = {};
      this.rejectHtml = '';
      this.rejectFileId = 0;
      this.appCabinetUuid = '';
    });
  }

  // Getters for computed values
  get uploadedCount(): number {
    return this.documents.filter(d => d.status === 'uploaded').length;
  }

  get archiveCount(): number {
    return this.documents.filter(d => d.status === 'from-archive').length;
  }

  get requiredNotUploadedCount(): number {
    return this.documents.filter(d => d.required && d.status === 'not-uploaded').length;
  }

  get isAllRequiredUploaded(): boolean {
    return this.requiredNotUploadedCount === 0;
  }
}

export const newStepperStore = new NewStepperStore();