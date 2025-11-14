// src/stores/UIStore.ts - обновленная версия с поддержкой всех табов
import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';

// In UIStore.ts, update the TabType:
export type TabType = 'info' | 'documents' | 'contract' | 'payment' | 'qrPayment' | 'final';
export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

export class UIStore {
  rootStore: RootStore;
  
  activeTab: TabType = 'info';
  
  editingFields: Set<string> = new Set();
  
  uploadingDocument: boolean = false;
  uploadProgress: number = 0;
  
  snackbarOpen: boolean = false;
  snackbarMessage: string = '';
  snackbarSeverity: SnackbarSeverity = 'info';
  
  dialogs: {
    confirmContract: boolean;
    paymentInfo: boolean;
    documentComment: boolean;
    signAct: boolean;
  } = {
    confirmContract: false,
    paymentInfo: false,
    documentComment: false,
    signAct: false
  };
  
  documentFilter: 'all' | 'approved' | 'rejected' | 'pending' = 'all';
  documentSort: 'date' | 'name' | 'status' = 'date';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setActiveTab(tab: TabType) {
    this.activeTab = tab;
  }

  toggleFieldEdit(field: string) {
    if (this.editingFields.has(field)) {
      this.editingFields.delete(field);
    } else {
      this.editingFields.clear();
      this.editingFields.add(field);
    }
  }

  isEditing(field: string): boolean {
    return this.editingFields.has(field);
  }

  closeAllEdits() {
    this.editingFields.clear();
  }

  setUploadingDocument(uploading: boolean) {
    this.uploadingDocument = uploading;
    if (!uploading) {
      this.uploadProgress = 0;
    }
  }

  setUploadProgress(progress: number) {
    this.uploadProgress = Math.min(100, Math.max(0, progress));
  }

  showSnackbar(message: string, severity: SnackbarSeverity = 'info') {
    this.snackbarMessage = message;
    this.snackbarSeverity = severity;
    this.snackbarOpen = true;
  }

  hideSnackbar() {
    this.snackbarOpen = false;
  }


}