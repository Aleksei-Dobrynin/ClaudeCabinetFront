import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { UploadedApplicationDocument, UploadedApplicationDocumentCreateModel } from "constants/UploadedApplicationDocument";
import { addUploadedApplicationDocumentFromOld, getAttachedOldDocuments } from "api/UploadedApplicationDocument";
// import { getUploadedApplicationDocumentsBy } from "api/UploadedApplicationDocument";
import { downloadFile } from "api/MainBackAPI";
// import { getUploadedApplicationDocumentsForApplication } from "api/UploadedApplicationDocument";
import dayjs, { Dayjs } from 'dayjs';

class NewStore {
  data = [];


  constructor() {
    makeAutoObservable(this);
  }

  async downloadFile(idFile: number, fileName) {
    try {
      MainStore.changeLoader(true);
      const response = await downloadFile(idFile);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const byteCharacters = atob(response.data.fileContents);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const mimeType = response.data.contentType || 'application/octet-stream';
        const fileNameBack = response.data.fileDownloadName;
        let url = ""

        if (fileNameBack.endsWith('.jpg') || fileNameBack.endsWith('.jpeg') || fileNameBack.endsWith('.png')) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: mimeType });
            url = window.URL.createObjectURL(blob);
            newWindow.document.write(`<img src="${url}" />`);
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error(i18n.t('label:fileDownload.errorOpenNewWindow'));
          }
        } else if (fileNameBack.endsWith('.pdf')) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            url = window.URL.createObjectURL(blob);
            newWindow.location.href = url;
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error(i18n.t('label:fileDownload.errorOpenNewWindow'));
          }
        } else {
          const blob = new Blob([byteArray], { type: mimeType });
          url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', response.data.fileDownloadName || fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async onPickedFile(fileId: number, appId: number, serviceDocId: number, onSaved: (id) => void) {
    var data: UploadedApplicationDocumentCreateModel = {
      Id: 0,
      FileId: fileId,
      Name: "",
      ServiceDocumentId: serviceDocId,
      ApplicationId: appId,
      StatusId: 1,
      HashCode: "",
      HashCodeDate: dayjs(),
      isSigned: false,

    };
    try {
      MainStore.changeLoader(true);
      let response;
      response = await addUploadedApplicationDocumentFromOld(data);
      if (response.status === 201 || response.status === 200) {
        onSaved(response.data.id);
        if (data.Id === 0) {
          MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
        } else {
          MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async loaduploaded_application_documents(idServiceDoc: number) {
    try {
      if (idServiceDoc == null) return;
      MainStore.changeLoader(true);
      const response = await getAttachedOldDocuments(idServiceDoc);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  clearStore() {
    runInAction(() => {
      this.data = [];
    });
  };
}

export default new NewStore();