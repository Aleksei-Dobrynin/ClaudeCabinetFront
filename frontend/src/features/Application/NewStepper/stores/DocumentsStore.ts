// stores/DocumentsStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import { 
  createUploadedApplicationDocumentWithFile, 
  updateUploadedApplicationDocumentWithFile,
  getUploadedApplicationDocumentsForApplication 
} from "api/UploadedApplicationDocument";
import dayjs, { Dayjs } from "dayjs";
import MainStore from "MainStore";
import i18n from "i18next";
import { downloadFile, downloadFileBga } from "api/MainBackAPI";
import { Service, ObjectTag, ApiResponse } from "constants/ApplicationApi";


export type UploadedApplicationDocument = {
  id: number;
  hashCode: string;
  hashCodeDate: Dayjs;
  serviceDocumentId: number;
  file_id?: number;
  isSigned?: boolean;
  is_signed?: boolean;
  is_outcome?: boolean;
  fileId: number;
  fileName: string;
  name: string;
  applicationId: number;
  statusId: number;
  is_required?: boolean;
  
  // Additional fields from the API response
  doc_name: string;
  app_doc_id: number;
  application_document_id: number;
  application_document_type_id: number;
  application_document_type_name: string;
  created_at?: string;
  file_name?: string;
  file_bga_id?: string;
  created_by?: number;
  document_number?: string;
  service_document_id?: number;
  status?: string;
};

export interface FileUpload {
  file: File;
  documentId: number;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export class DocumentsStore {

  fileType: string = '';
  fileUrl: any = null;
  isOpenFileView: boolean = false;

  rootStore: RootStore;

  // Uploaded documents from server
  uploadedDocuments: UploadedApplicationDocument[] = [];

  // File uploads in progress
  fileUploads: Record<string, FileUpload> = {};

  // Loading states
  isLoadingDocuments = false;

  // Errors
  errors: Record<string, string> = {};

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  async loadInitialData() {
    await this.loadUploadedDocuments();
  }

  async loadUploadedDocuments() {
    this.isLoadingDocuments = true;
    try {
      const response = await getUploadedApplicationDocumentsForApplication(this.rootStore.applicationId);
      
      if ((response?.status === 200 || response?.status === 201) && response.data) {
        runInAction(() => {
          this.uploadedDocuments = response.data?.filter(x=>x.doc_name !== "Заявление"); //TODO
        });
      }
    } catch (error) {
      console.error("Error loading documents:", error);
      this.rootStore.showSnackbar(i18n.t("documents.error.loadingDocuments"), "error");
    } finally {
      runInAction(() => {
        this.isLoadingDocuments = false;
      });
    }
  }

  // Get mandatory documents (is_required = true && is_outcome != true)
  get mandatoryDocuments() {
    return this.uploadedDocuments.filter(doc => 
      doc.is_required === true && doc.is_outcome !== true
    );
  }

  // Get optional documents (is_required != true && is_outcome != true)
  get optionalDocuments() {
    return this.uploadedDocuments.filter(doc => 
      doc.is_required !== true && doc.is_outcome !== true
    );
  }

  // Check if document is uploaded
  isDocumentUploaded(documentId: number): boolean {
    const doc = this.uploadedDocuments.find(d => d.id === documentId);
    return doc?.app_doc_id !== 0 && doc?.app_doc_id !== undefined;
  }

  // Check if all mandatory documents are uploaded
  get isAllRequiredUploaded(): boolean {
    return this.mandatoryDocuments.every(doc => doc.app_doc_id !== 0);
  }

  // Get upload progress for a document
  getUploadProgress(documentId: number): number {
    const upload = Object.values(this.fileUploads).find(u => u.documentId === documentId);
    return upload?.progress || 0;
  }

  // Check if document is currently uploading
  isUploading(documentId: number): boolean {
    const upload = Object.values(this.fileUploads).find(u => u.documentId === documentId);
    return upload?.status === 'uploading';
  }

  async uploadFile(documentId: number, file: File) {
    const uploadKey = `${documentId}_${Date.now()}`;
    
    runInAction(() => {
      this.fileUploads[uploadKey] = {
        file,
        documentId,
        progress: 0,
        status: 'uploading'
      };
    });

    try {
      const document = this.uploadedDocuments.find(d => d.id === documentId);
      if (!document) {
        throw new Error(i18n.t("documents.error.documentNotFound"));
      }

      const data: any = {
        id: document.app_doc_id || 0,
        hashCode: document.hashCode || "",
        hashCodeDate: dayjs(),
        serviceDocumentId: document.service_document_id || documentId,
        isSigned: false,
        fileId: document.file_id || 0,
        name: document.doc_name,
        applicationId: this.rootStore.applicationId,
        statusId: 1,
        fileName: file.name
      };

      // Simulate progress
      const progressInterval = setInterval(() => {
        runInAction(() => {
          const upload = this.fileUploads[uploadKey];
          if (upload && upload.progress < 90) {
            upload.progress += 10;
          }
        });
      }, 300);

      let response;
      if (document.app_doc_id === 0) {
        // Create new document
        response = await createUploadedApplicationDocumentWithFile(data, file.name, file);
      } else {
        // Update existing document
        response = await updateUploadedApplicationDocumentWithFile(data, file.name, file);
      }

      clearInterval(progressInterval);

      if (response?.status === 200 || response?.status === 201) {
        runInAction(() => {
          this.fileUploads[uploadKey].progress = 100;
          this.fileUploads[uploadKey].status = 'success';
        });

        this.rootStore.showSnackbar(i18n.t("documents.success.uploaded"), "success");
        
        // Reload documents after successful upload
        await this.loadUploadedDocuments();
      } else {
        throw new Error(i18n.t("documents.error.uploadFailed"));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      runInAction(() => {
        this.fileUploads[uploadKey].status = 'error';
        this.fileUploads[uploadKey].error = i18n.t("documents.error.uploadError");
      });
      this.rootStore.showSnackbar(i18n.t("documents.error.uploadError"), "error");
    } finally {
      // Clean up completed upload after delay
      setTimeout(() => {
        runInAction(() => {
          delete this.fileUploads[uploadKey];
        });
      }, 2000);
    }
  }

  async OpenFileFile(idFile: number, fileName) {
    try {
      MainStore.changeLoader(true);
      const response = await downloadFile(idFile);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const byteCharacters = atob(response.data.file_contents);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        let mimeType = 'application/pdf';
        this.fileType = 'pdf';
        if (fileName.endsWith('.png')) {
          mimeType = 'image/png';
          this.fileType = 'png';
        }
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
          mimeType = 'image/jpeg';
          this.fileType = 'jpg';
        }
        const blob = new Blob([byteArray], { type: mimeType });
        this.fileUrl = URL.createObjectURL(blob);
        this.isOpenFileView = true;
        return
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async deleteFile(documentId: number) {
    try {
      // Here you would call the delete API
      // For now, just reload the documents
      await this.loadUploadedDocuments();
      this.rootStore.showSnackbar(i18n.t("documents.success.deleted"), "success");
    } catch (error) {
      console.error("Error deleting file:", error);
      this.rootStore.showSnackbar(i18n.t("documents.error.deleteError"), "error");
    }
  }

  reset() {
    this.uploadedDocuments = [];
    this.fileUploads = {};
    this.errors = {};
  }
}