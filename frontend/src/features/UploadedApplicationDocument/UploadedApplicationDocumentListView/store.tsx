import { runInAction, makeObservable, observable } from "mobx";
import i18n from "i18next";
//TODO API 
import { acceptuploaded_application_document, deleteuploaded_application_document } from "api/MainBackAPI";
// import { getuploaded_application_documentsBy } from "api/MainBackAPI";
import { getUploadedApplicationDocumentsForApplication } from "api/UploadedApplicationDocument";

import { downloadFile, downloadFileBga } from "api/MainBackAPI";


import BaseStore from 'core/stores/BaseStore';
import MainStore from "MainStore";
import { deleteUploadedApplicationDocument } from "api/UploadedApplicationDocument";
import { UploadedApplicationDocument } from "constants/UploadedApplicationDocument";
import { getUploadedApplicationDocumentsByApplicationId } from "api/UploadedApplicationDocument";

class UploadedApplicationDocumentListStore extends BaseStore {
  @observable data: UploadedApplicationDocument[] = [];
  @observable openPanel: boolean = false;
  @observable currentId: number = 0;
  @observable mainId: number = 0;
  @observable isEdit: boolean = false;
  @observable idDocumentAttach: number = 0;
  @observable openPanelAttachFromOtherDoc: boolean = false;
  @observable service_document_id: number = 0;
  @observable incomingData: [] = [];
  @observable outgoingData: [] = [];
  @observable selectedRows: number[] = [];
  @observable isIncoming: boolean = false;
  @observable File: any = null;
  @observable fileType: string = '';
  @observable fileUrl: any = null;
  @observable isOpenFileView: boolean = false;


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore(); // Call parent's clearStore first
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.openPanel = false;
      this.mainId = 0;
      this.isEdit = false;
      this.selectedRows = [];
    });
  }

  changeSelectedRows(rows) {
    this.selectedRows = rows;
  }

  setMainId = async (id: number) => {
    if (id !== this.mainId) {
      this.mainId = id;
      await this.loadUploadedApplicationDocuments()
    }
  }

  isDocumentsUploaded = () => {
    const requiredDocs = this.data.filter(x => x.is_required);
    const optionalDocs = this.data.filter(x => !x.is_required);

    if (
      requiredDocs.some(
        x => !x.is_signed || x.file_id == null
      )
    ) {
      return false;
    }

    if (
      optionalDocs.some(
        x => x.file_id != null && !x.is_signed
      )
    ) {
      return false;
    }

    return true;
  };

  signSelectedDocuments() {
    let filesIds = this.data.filter(x => x.file_id != null && this.selectedRows.includes(x.id)).map(x => x.file_id)
    MainStore.openDigitalSign(
      filesIds,
      this.mainId,
      async () => {
        MainStore.onCloseDigitalSign();
        runInAction(() => {
          for (let i = 0; i < this.data.length; i++) {
            if (filesIds.includes(this.data[i].file_id))
              this.data[i].is_signed = true; //TODO
          }
        })
      },
      () => MainStore.onCloseDigitalSign(),
    );
  };

  onEditClicked(id: number) {
    runInAction(() => {
      this.openPanel = true;
      this.currentId = id;
    });
  }

  closePanel() {
    runInAction(() => {
      this.openPanel = false;
      this.currentId = 0;
    });
  }

  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
  }

  loadUploadedApplicationDocuments = async () => {
    if (this.mainId === 0) return;

    this.apiCall(
      () => getUploadedApplicationDocumentsForApplication(this.mainId),
      (data) => {
        if (Array.isArray(data)) {
          runInAction(() => {
            this.data = data;
          });
        }
      }
    );
  };
  //TODO Functions
  async acceptDocumentWithoutFile(serDoc: number) {
    var data = {
      id: 0,
      file_id: 0,
      application_document_id: this.mainId,
      name: "",
      service_document_id: serDoc,
      created_at: null,
      updated_at: null,
      created_by: 0,
      updated_by: 0,
      document_number: ""
    };
    try {
      MainStore.changeLoader(true);
      let response;
      response = await acceptuploaded_application_document(data);
      if (response.status === 201 || response.status === 200) {
        this.loaduploaded_application_documents()
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async rejectDocument(upl_id: number) {
    try {
      MainStore.changeLoader(true);
      let response;
      response = await deleteuploaded_application_document(upl_id);
      if (response.status === 201 || response.status === 200) {
        this.loaduploaded_application_documents()
        MainStore.setSnackbar(i18n.t("message:snackbar.successDelete"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async loaduploaded_application_documents() {
    try {
      MainStore.changeLoader(true);
      const response = await getUploadedApplicationDocumentsForApplication(this.mainId);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data
        const out_doc = response.data.filter(el => el.is_outcome === true);
        this.outgoingData = out_doc;
        const inc_doc = response.data.filter(el => el.is_outcome === false || el.is_outcome === null);
        this.incomingData = inc_doc;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  attachClicked(idDocument: number, service_document_id: number) {
    this.service_document_id = service_document_id;
    this.openPanelAttachFromOtherDoc = true;
    this.idDocumentAttach = idDocument;
  }

  uploadFile(service_document_id: number, upload_id: number) {
    this.service_document_id = service_document_id;
    this.currentId = upload_id
    this.openPanel = true;
  }

  closePanelAttach() {
    this.openPanelAttachFromOtherDoc = false;
    this.idDocumentAttach = 0;
    this.currentId = 0;
  }


  async downloadFile(idFile: number, fileName, isMain: boolean) { //TODO
    try {
      MainStore.changeLoader(true);
      const response = (isMain ? await downloadFileBga(idFile) : await downloadFile(idFile));
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const byteCharacters = atob(response.data.file_contents);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const mimeType = response.data.content_type || 'application/octet-stream';
        const fileNameBack = response.data.file_download_name;

        let url = ""

        if (fileNameBack.endsWith('.jpg') || fileNameBack.endsWith('.jpeg') || fileNameBack.endsWith('.png')) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: mimeType });
            url = window.URL.createObjectURL(blob);
            newWindow.document.write(`<img src="${url}" />`);
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error(i18n.t("message:error.openNewWindow"));
          }
        } else if (fileNameBack.endsWith('.pdf')) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            url = window.URL.createObjectURL(blob);
            newWindow.location.href = url;
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error(i18n.t("message:error.openNewWindow"));
          }
        }

        const blob = new Blob([byteArray], { type: mimeType });
        url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', response.data.file_download_name || fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  checkFile(fileName: string) {
    return (fileName.toLowerCase().endsWith('.jpg') ||
      fileName.toLowerCase().endsWith('.jpeg') ||
      fileName.toLowerCase().endsWith('.png') ||
      fileName.toLowerCase().endsWith('.pdf'));
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

  deleteUploadedApplicationDocument = (id: number) => {
    this.showConfirmDialog(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        this.apiCall(
          () => deleteUploadedApplicationDocument(id),
          () => {
            this.loadUploadedApplicationDocuments();
            this.showSuccessSnackbar(i18n.t("message:snackbar.successDelete"));
          },
          (err) => {
            MainStore.openErrorDialog(i18n.t("message:error.documentIsAlreadyInUse"));
          }
        );
        MainStore.onCloseConfirm();
      }
    );
  };
}



export default new UploadedApplicationDocumentListStore();