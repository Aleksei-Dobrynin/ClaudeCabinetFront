// stores/PrintStore.ts

import { makeAutoObservable, runInAction } from 'mobx';
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
    runInAction(() => {
      this.isGenerating = true;
    });
    
    try {
      // Имитация генерации документов
      // В реальном приложении здесь будет API запрос
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      runInAction(() => {
        this.generatedDocuments = this.printDocuments.map(doc => ({
          id: doc.id,
          name: doc.name,
          url: `/api/documents/print/${this.rootStore.applicationId}/${doc.id}`
        }));
        
        // Обновляем URL в printDocuments
        this.generatedDocuments.forEach(genDoc => {
          const printDoc = this.printDocuments.find(d => d.id === genDoc.id);
          if (printDoc) {
            printDoc.url = genDoc.url;
          }
        });
      });
      
      this.rootStore.showSnackbar(i18n.t('prints.success.documentsReady'), 'success');
      return true;
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
    runInAction(() => {
      this.printHistory.push({
        documentId,
        printedAt: new Date()
      });
    });
    
    // В реальном приложении здесь будет открытие документа или диалог печати
    if (doc.url) {
      window.open(doc.url, '_blank');
    } else {
      window.print();
    }
    
    this.rootStore.showSnackbar(i18n.t('prints.success.documentPrinted', { name: doc.name }), 'info');
  }
  
  async printAll() {
    // Генерируем документы если они ещё не сгенерированы
    if (this.generatedDocuments.length === 0) {
      const success = await this.generateDocuments();
      if (!success) return;
    }
    
    // Печатаем все документы
    this.printDocuments.forEach((doc, index) => {
      setTimeout(() => {
        this.printDocument(doc.id);
      }, index * 500); // Небольшая задержка между печатью
    });
    
    this.rootStore.showSnackbar(i18n.t('prints.success.allDocumentsPrinted'), 'info');
  }
  
  previewDocument(documentId: number) {
    const doc = this.printDocuments.find(d => d.id === documentId);
    if (!doc) return;
    
    // В реальном приложении здесь будет показ превью или открытие в новой вкладке
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
    runInAction(() => {
      this.checklist = {
        allPrinted: false,
        applicantSigned: false,
        receiptGiven: false,
        registrarSigned: false
      };
      this.generatedDocuments = [];
      this.printHistory = [];
      
      // Сбрасываем URLs в printDocuments
      this.printDocuments.forEach(doc => {
        delete doc.url;
      });
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