// stores/PrintStore.ts

import { makeAutoObservable, runInAction } from 'mobx';
import ApiService from '../services/ApiService';
import { RootStore } from './RootStore';
import i18n from 'i18next';

export interface PrintDocument {
  id: number;
  name: string;
  description: string;
  signatures: string;
  copies: number;
  isPrimary?: boolean;
  url?: string;
}

export interface PrintChecklist {
  allPrinted: boolean;
  applicantSigned: boolean;
  receiptGiven: boolean;
  registrarSigned: boolean;
}

export class PrintStore {
  rootStore: RootStore;
  
  printDocuments: PrintDocument[] = [
    {
      id: 1,
      name: i18n.t('prints.documents.applicationForm'),
      description: i18n.t('prints.documents.applicationFormDescription'),
      signatures: i18n.t('prints.documents.applicantRegistrarSignatures'),
      copies: 1,
      isPrimary: true
    },
    {
      id: 2,
      name: i18n.t('prints.documents.receiptForm'),
      description: i18n.t('prints.documents.receiptFormDescription'),
      signatures: i18n.t('prints.documents.applicantRegistrarSignatures'),
      copies: 1
    },
    {
      id: 3,
      name: i18n.t('prints.documents.documentsList'),
      description: i18n.t('prints.documents.documentsListDescription'),
      signatures: i18n.t('prints.documents.applicantRegistrarSignatures'),
      copies: 2
    }
  ];
  
  checklist: PrintChecklist = {
    allPrinted: false,
    applicantSigned: false,
    receiptGiven: false,
    registrarSigned: false
  };
  
  isGenerating = false;
  generatedDocuments: Array<{ id: number; name: string; url: string }> = [];
  printHistory: Array<{ documentId: number; printedAt: Date }> = [];
  
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  
  updateChecklist<K extends keyof PrintChecklist>(field: K, value: boolean) {
    this.checklist[field] = value;
  }
  
  toggleChecklistItem(field: keyof PrintChecklist) {
    this.checklist[field] = !this.checklist[field];
  }
  
  get isChecklistComplete(): boolean {
    return Object.values(this.checklist).every(v => v === true);
  }
  
  get checklistProgress(): number {
    const completed = Object.values(this.checklist).filter(v => v).length;
    return (completed / Object.keys(this.checklist).length) * 100;
  }
  
  async generateDocuments(): Promise<boolean> {
    this.isGenerating = true;
    try {
      const applicationId = this.rootStore.applicationId || 'temp-id';
      const result = await ApiService.generatePrintDocuments(applicationId);
      
      if (result.success && result.data) {
        runInAction(() => {
          // this.generatedDocuments = result.data.documents;
          // // Update print documents with URLs
          // this.generatedDocuments.forEach(genDoc => {
          //   const printDoc = this.printDocuments.find(d => d.id === genDoc.id);
          //   if (printDoc) {
          //     printDoc.url = genDoc.url;
          //   }
          // });
        });
        this.rootStore.showSnackbar(i18n.t('prints.success.documentsReady'), 'success');
        return true;
      }
      return false;
    } catch (error) {
      this.rootStore.showSnackbar(i18n.t('prints.error.generateDocumentsError'), 'error');
      console.error('Generate documents error:', error);
      return false;
    } finally {
      runInAction(() => {
        this.isGenerating = false;
      });
    }
  }
  
  printDocument(documentId: number) {
    const doc = this.printDocuments.find(d => d.id === documentId);
    if (!doc) return;
    
    // Record print history
    this.printHistory.push({
      documentId,
      printedAt: new Date()
    });
    
    // In real application, this would open the document URL or trigger print dialog
    if (doc.url) {
      window.open(doc.url, '_blank');
    } else {
      window.print();
    }
    
    this.rootStore.showSnackbar(i18n.t('prints.success.documentPrinted', { name: doc.name }), 'info');
  }
  
  async printAll() {
    // Generate documents if not already generated
    if (this.generatedDocuments.length === 0) {
      const success = await this.generateDocuments();
      if (!success) return;
    }
    
    // Print all documents
    this.printDocuments.forEach(doc => {
      setTimeout(() => {
        this.printDocument(doc.id);
      }, 500); // Small delay between prints
    });
    
    this.rootStore.showSnackbar(i18n.t('prints.success.allDocumentsPrinted'), 'info');
  }
  
  previewDocument(documentId: number) {
    const doc = this.printDocuments.find(d => d.id === documentId);
    if (!doc) return;
    
    // In real application, this would show a preview modal or open in new tab
    this.rootStore.showSnackbar(i18n.t('prints.success.documentPreview', { name: doc.name }), 'info');
  }
  
  validate(): boolean {
    if (!this.isChecklistComplete) {
      const uncheckedItems = [];
      if (!this.checklist.allPrinted) uncheckedItems.push(i18n.t('prints.checklist.printAllDocuments'));
      if (!this.checklist.applicantSigned) uncheckedItems.push(i18n.t('prints.checklist.getApplicantSignature'));
      if (!this.checklist.receiptGiven) uncheckedItems.push(i18n.t('prints.checklist.giveReceiptToApplicant'));
      if (!this.checklist.registrarSigned) uncheckedItems.push(i18n.t('prints.checklist.signDocumentsByRegistrar'));
      
      this.rootStore.showSnackbar(
        i18n.t('prints.error.completeAllItems', { items: uncheckedItems.join(', ') }),
        'warning'
      );
      return false;
    }
    return true;
  }
  
  reset() {
    this.checklist = {
      allPrinted: false,
      applicantSigned: false,
      receiptGiven: false,
      registrarSigned: false
    };
    this.generatedDocuments = [];
    this.printHistory = [];
    
    // Reset URLs in print documents
    this.printDocuments.forEach(doc => {
      delete doc.url;
    });
  }
  
  getFormData() {
    return {
      checklist: this.checklist,
      checklistComplete: this.isChecklistComplete,
      printHistory: this.printHistory.map(h => ({
        documentId: h.documentId,
        documentName: this.printDocuments.find(d => d.id === h.documentId)?.name,
        printedAt: h.printedAt.toISOString()
      }))
    };
  }
}