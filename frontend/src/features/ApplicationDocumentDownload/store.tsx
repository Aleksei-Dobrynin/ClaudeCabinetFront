import { makeObservable, runInAction, observable, action } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { getDocumentByGuid, downloadDocumentByGuid } from "api/Application";
import { FileSign } from "constants/Application";
import { downloadFileBga, getPaidInvoiceByGuid } from "api/MainBackAPI";

interface ApplicationResponse {
  id: number;
}

class ApplicationStore extends BaseStore {
  @observable id: number = 0
  @observable comment: string = ""
  @observable file_name: string = ""
  @observable fileType: string = ""
  @observable fileUrl: string = ""
  @observable filePath: string = ""
  @observable isOpenFileView: boolean = false
  @observable signs: FileSign[] = []

  @observable hasDocument: boolean = false;
  @observable isLoading: boolean = false;
  @observable downloadError: string = "";
  @observable documentFound: boolean = false;
  @observable file_type_name: string = "";
  // PDF viewing fields
  @observable isPdfFile: boolean = false;

  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0;
      this.comment = "";
      this.file_name = "";
      this.signs = [];
      this.hasDocument = false;
      this.isLoading = false;
      this.downloadError = "";
      this.documentFound = false;
      this.file_type_name = "";
      this.isPdfFile = false;
    });
  }

  async doLoad(guid: string) {
    await this.checkDocumentExists(guid);
  }

  async openFileView(idFile: number, fileName: string) {
    try {
      MainStore.changeLoader(true);
      const response = await downloadFileBga(idFile);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const byteCharacters = atob(response.data.file_contents);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        let mimeType = "application/pdf";
        this.fileType = "pdf";
        if (fileName.endsWith(".png")) {
          mimeType = "image/png";
          this.fileType = "png";
        }
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
          mimeType = "image/jpeg";
          this.fileType = "jpg";
        }
        const blob = new Blob([byteArray], { type: mimeType });
        this.fileUrl = URL.createObjectURL(blob);
        this.isOpenFileView = true;
        return;
      } else {
        throw new Error();
      }
    } catch (err) {
      // MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  checkDocumentExists = async (guid: string) => {
    runInAction(() => {
      this.isLoading = true;
      this.downloadError = "";
      this.documentFound = false;
      this.hasDocument = false;
      this.isPdfFile = false;
    });

    try {
      MainStore.changeLoader(true);

      const response = await getDocumentByGuid(guid);

      if ((response?.status === 200 || response?.status === 201) && response?.data) {
        runInAction(() => {
          this.documentFound = true;
          this.id = response.data.id;
          this.file_name = response.data.file_name;
          if (response.data?.signs?.length > 0){
            this.file_type_name = response.data.signs[0]?.file_type_name || i18n.t("application.document.type.unknown");
          }
          this.signs = response.data.signs;
          
          const fileExtension = this.file_name.split('.').pop()?.toLowerCase();
          this.isPdfFile = fileExtension === 'pdf';
        });
      } else {
        throw new Error(i18n.t("label:documentStore.error.notFound"));
      }
    } catch (error: any) {
      runInAction(() => {
        this.hasDocument = false;
        this.documentFound = false;
        this.downloadError = error.message || i18n.t("label:documentStore.error.loadingError");
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
      MainStore.changeLoader(false);
    }
  };

  viewPdfInNewTab = async (guid: string) => {
    runInAction(() => {
      this.isLoading = true;
      this.downloadError = "";
    });

    try {
      MainStore.changeLoader(true);
      
      const downloadResponse = await downloadDocumentByGuid(guid);
      
      if (downloadResponse?.status === 200 && downloadResponse?.data) {
        const blob = downloadResponse.data;

        if (blob instanceof Blob && blob.size > 0) {
          const contentType = downloadResponse.headers?.['content-type'] || 'application/pdf';
          const typedBlob = new Blob([blob], { type: contentType });
          
          const blobUrl = window.URL.createObjectURL(typedBlob);
          const newWindow = window.open(blobUrl, '_blank');
          
          if (newWindow) {
            newWindow.document.title = this.file_name || i18n.t("label:documentStore.defaultTitle");
            
            setTimeout(() => {
              window.URL.revokeObjectURL(blobUrl);
            }, 60000);
          } else {
            
            this.downloadFile(typedBlob, this.file_name);
            throw new Error(i18n.t("label:documentStore.error.openNewWindow"));
          }
          
          runInAction(() => {
            this.hasDocument = true;
          });
        } else {
          throw new Error(i18n.t("label:documentStore.error.emptyFile"));
        }
      } else {
        throw new Error(i18n.t("label:documentStore.error.serverError"));
      }
    } catch (error: any) {
      console.error(i18n.t("label:documentStore.error.viewError"), error);
      runInAction(() => {
        this.downloadError = error.message || i18n.t("label:documentStore.error.openFile");
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
      MainStore.changeLoader(false);
    }
  };

  downloadDirectly = async (guid: string) => {
    return this.downloadDocument(guid);
  };

  downloadDocument = async (guid: string) => {
    runInAction(() => {
      this.isLoading = true;
      this.downloadError = "";
    });

    try {
      MainStore.changeLoader(true);
      
      const downloadResponse = await downloadDocumentByGuid(guid);
      
      if (downloadResponse?.status === 200 && downloadResponse?.data) {
        const blob = downloadResponse.data;
        const text = await blob.text();
        const parsed = JSON.parse(text);

        const base64 = parsed.fileContents;

        const binary = atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i);
        }

        if (bytes.length > 0) {
          let fileName = this.file_name || 'document';

          const contentType = downloadResponse.headers?.['content-type'] || this.getMimeType(fileName);
          const typedBlob = new Blob([bytes], { type: contentType });
          
          this.downloadFile(typedBlob, fileName);
          
          runInAction(() => {
            // this.hasDocument = true;
          });
        } else {
          throw new Error(i18n.t("label:documentStore.error.emptyFile"));
        }
      } else {
        throw new Error(i18n.t("label:documentStore.error.serverError"));
      }
    } catch (error: any) {
      console.error(i18n.t("label:documentStore.error.downloadError"), error);
      runInAction(() => {
        this.downloadError = error.message || i18n.t("label:documentStore.error.downloadFile");
        this.hasDocument = false;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
      MainStore.changeLoader(false);
    }
  };

  private downloadFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    try {
      Object.assign(a, {
        href: url,
        download: fileName,
        style: 'display:none',
        rel: 'noopener',
      });

      document.body.appendChild(a);
      a.click();
    } finally {
      requestAnimationFrame(() => URL.revokeObjectURL(url));
      a.remove();
    }
  }

  viewPdfInline = async (guid: string) => {
    runInAction(() => {
      this.isLoading = true;
      this.downloadError = "";
    });

    try {
      MainStore.changeLoader(true);

      const downloadResponse = await downloadDocumentByGuid(guid);

      if (downloadResponse?.status === 200 && downloadResponse?.data) {
        const blob = downloadResponse.data;
        const text = await blob.text();
        const parsed = JSON.parse(text);

        const base64 = parsed.fileContents;
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }

        const pdfBlob = new Blob([bytes], { type: 'application/pdf' });

        runInAction(() => {
          this.filePath = URL.createObjectURL(pdfBlob);
          console.log(this.filePath)
          this.fileType = "pdf";
          this.isPdfFile = true;
        });
      } else {
        throw new Error("Не удалось получить файл");
      }
    } catch (err: any) {
      runInAction(() => {
        this.downloadError = err.message;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
      MainStore.changeLoader(false);
    }
  }

  private getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    const mimeTypes: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'txt': 'text/plain',
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
    };

    return mimeTypes[extension || ''] || 'application/octet-stream';
  }
}

export default new ApplicationStore();