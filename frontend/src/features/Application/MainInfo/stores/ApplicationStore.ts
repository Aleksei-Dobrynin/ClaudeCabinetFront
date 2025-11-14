// src/stores/ApplicationStore.ts - Полностью исправленная версия
import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import {
  Application,
  Document,
  Correction,
  ArchObject,
  District,
  Tag,
  Invoice,
  Contract,
  CompletionAct,
  FinalDocument,
  ApplicationMain,
} from "constants/ApplicationMain";
import { ApiResponse } from "constants/apiMain";
import { getApplication, getMainApplicationByGuid, reSendToBga, sendToBga, updateApplication } from "api/Application";
import { getCustomer, updateCustomer } from "api/Customer";
import { getUploadedApplicationDocumentsForApplication } from "api/UploadedApplicationDocument";
import { downloadFile, downloadFileBga, getPaidInvoiceByGuid } from "api/MainBackAPI";
import MainStore from "MainStore";
import { getDistricts, getTags } from "api/ArchObject";
import { ApplicationCreateModel } from "constants/Application";
import dayjs from "dayjs";
import { Customer } from "constants/Customer";
import { PaidAmmount } from "api/MainBackAPI/models/upladed_application_document";
import {getPaidAmmountByGuid} from "api/MainBackAPI"
export class ApplicationStore {
  rootStore: RootStore;

  applicationId: number = 0;
  application: Application | null = null;
  applicationMain: ApplicationMain | null = null;
  customer: Customer | null = null;
  documents: Document[] = [];
  allDocs: Document[] = [];
  payments = []
  outcomeDocs: Document[] = [];
  districts: District[] = [];
  tags: Tag[] = [];
  checkedDocs: number[] = [];
  isLoading: boolean = false;
  isSaving: boolean = false;
  lastUpdated: Date | null = null;
  optimisticUpdates: Map<string, any> = new Map();

  // doc upload
  openPanelUploadDoc: boolean = false;
  uplId: number = 0;
  serviceDocId: number = 0;

  // file viewer
  isOpenFileView: boolean = false;
  fileType: string = "";
  fileUrl: any = null;
  paymentAmount: PaidAmmount | null = null
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {
      rootStore: false
    });
  }

  get lastUpdatedFormatted(): string {
    if (!this.lastUpdated) return "Никогда";
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(this.lastUpdated);
  }

  changeCheckedDoc = (id: number, value: boolean) => {
    if (value) {
      this.checkedDocs = [...this.checkedDocs, id];
    } else {
      this.checkedDocs = this.checkedDocs.filter((docId) => docId !== id);
    }
  };

  signSelectedDocuments() {
    let filesIds = this.allDocs
      .filter((x) => x.file_id != null && this.checkedDocs.includes(x.id))
      .map((x) => x.file_id);
    MainStore.openDigitalSign(
      filesIds,
      this.applicationId,
      async () => {
        MainStore.onCloseDigitalSign();
        await this.fetchDocuments();
        await this.fetchApplication();
        this.checkedDocs = [];
      },
      () => MainStore.onCloseDigitalSign()
    );
  }

  openPanelUploadDocument(uplId: number, serviceDocId: number) {
    this.openPanelUploadDoc = true;
    this.uplId = uplId;
    this.serviceDocId = serviceDocId;
  }

  closePanelUploadDoc() {
    this.openPanelUploadDoc = false;
    this.uplId = 0;
    this.serviceDocId = 0;
  }

async doLoad(applicationId: number) {
  this.applicationId = applicationId;
  await this.fetchApplication();
  await this.fetchPaymentAmount(); // Add this line
  await Promise.all([this.loadDistricts(), this.loadTags()]);
}

  async loadDistricts() {
    try {
      const response = await getDistricts();
      if ((response.status === 200 || response.status === 201) && response.data) {
        runInAction(() => {
          this.districts = response.data;
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки районов:", error);
    }
  }

  async loadTags() {
    try {
      const response = await getTags();
      if ((response.status === 200 || response.status === 201) && response.data) {
        runInAction(() => {
          this.tags = response.data;
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки тегов:", error);
    }
  }

  async fetchApplication() {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      const response = await getApplication(this.applicationId);

      if ((response?.status === 200 || response?.status === 201) && response?.data) {
        runInAction(() => {
          this.application = response.data;
          this.lastUpdated = new Date();
        });

        if (response.data.company_id) {
          await this.fetchCustomer(response.data.company_id);
        }
        if (response.data.app_cabinet_uuid) {
          await this.getMainApplication(response.data.app_cabinet_uuid);
        }

        await this.fetchDocuments();
        await this.fetchPayments();
      }
    } catch (error: any) {
      this.rootStore.errorStore.setError(
        "fetchApplication",
        error.message || "Ошибка загрузки заявки"
      );
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async getMainApplication(guid: string) {
    try {
      const response = await getMainApplicationByGuid(guid);

      if ((response?.status === 200 || response?.status === 201) && response?.data) {
        runInAction(() => {
          this.applicationMain = response.data
        });
      }
    } catch (error: any) {
      this.rootStore.errorStore.setError(
        "fetchApplication",
        error.message || "Ошибка загрузки заявки"
      );
      throw error;
    }
  }

  async fetchCustomer(customerId: number) {
    try {
      const response = await getCustomer(customerId);

      if ((response.status === 200 || response.status === 201) && response.data) {
        runInAction(() => {
          this.customer = response.data;
          if (this.application) {
            this.application.customer = response.data;
          }
        });
      }
    } catch (error: any) {
      console.error("Ошибка загрузки данных заказчика:", error);
    }
  }

  async reSendToBga() {
    MainStore.openErrorConfirm(
      "Вы уверены?",
      "Да",
      "Нет",
      async () => {
        try {
          const response = await reSendToBga(this.applicationId);
          if ((response?.status === 200 || response?.status === 201) && response?.data) {
            await this.fetchApplication();
          }
        } catch (error: any) {
          console.error("Ошибка загрузки документов:", error);
        } finally {
          MainStore.onCloseConfirm();
        }
      },
      () => {
        MainStore.onCloseConfirm();
      }
    );
  }

  async fetchDocuments() {
    try {
      const response = await getUploadedApplicationDocumentsForApplication(this.applicationId);

      if ((response?.status === 200 || response?.status === 201) && response?.data) {
        runInAction(() => {
          this.allDocs = response.data;
          this.documents = response.data.filter((x: any) => x.is_outcome !== true);
          this.outcomeDocs = response.data.filter((x: any) => x.is_outcome === true);
        });
      }
    } catch (error: any) {
      console.error("Ошибка загрузки документов:", error);
    }
  }

  async fetchPayments() {
    try {
      const response = await getPaidInvoiceByGuid(this.applicationId);

      if ((response?.status === 200 || response?.status === 201) && response?.data) {
        runInAction(() => {
          this.payments = response?.data
        });
      }
    } catch (error: any) {
      console.error("Ошибка загрузки оплаты:", error);
    }
  }

  async openFileView(idFile: number, fileName: string) {
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

  async fetchPaymentAmount() {
    try {
      const response = await getPaidAmmountByGuid(this.applicationId);
      if ((response?.status === 200 || response?.status === 201) && response?.data) {
        runInAction(() => {
          this.paymentAmount = response.data;
          this.application.total_paid = response.data.total_payed;
          this.application.total_sum = response.data.total_sum;
        });
      }
    } catch (error: any) {
      console.error("Ошибка загрузки суммы платежа:", error);
    }
  }

  async openFileFromBga(idFile: number, fileName: string) {
    try {
      MainStore.changeLoader(true);
      const response = await downloadFileBga(idFile);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const byteCharacters = atob(response.data.fileContents);
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
      // MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  // Обновление данных заявки
  async updateApplication(updates: Partial<Application>) {
    if (!this.application || this.isSaving) return;

    runInAction(() => {
      this.isSaving = true;
    });

    this.rootStore.errorStore.clearError("updateApplication");

    const previousState = { ...this.application };

    runInAction(() => {
      this.application = { ...this.application!, ...updates };
    });

    // Безопасная проверка и маппинг archObjects
    const archObjects = this.application.arch_objects || [];
    const obj = archObjects.map((x) => {
      return {
        id: x.id || 0,
        districtId: x.districtId || 0,
        address: x.address || '',
        name: x.name || '',
        address_street: x.address_street || '',
        address_building: x.address_building || '',
        address_flat: x.address_flat || '',
        identifier: x.identifier || '',
        description: x.description || '',
        applicationId: x.applicationId || this.applicationId,
        tags: x.tags || [],
        xCoord: x.xCoord || undefined,
        yCoord: x.yCoord || undefined,
      };
    });

    const data: ApplicationCreateModel = {
      id: this.applicationId - 0,
      workDescription: this.application.work_description || '',
      archObjectId: null,
      statusId: this.application.status_id || 0,
      companyId: this.application.company_id || 0,
      rServiceId: this.application.r_service_id || 0,
      rServiceName: this.application.r_service_name || '',
      uniqueCode: this.application.unique_code || '',
      registrationDate: dayjs(this.application.registration_date),
      lastUpdatedStatus: dayjs(this.application.last_updated_status),
      deadline: dayjs(this.application.deadline),
      number: this.application.number || '',
      comment: this.application.comment || '',
      archObjects: obj,
      appCabinetUuid: this.application.app_cabinet_uuid || '',
    };

    try {
      const response = await updateApplication(data);

      if ((response?.status === 200 || response?.status === 201) && response.data) {
        runInAction(() => {
          this.lastUpdated = new Date();
        });
        this.rootStore.uiStore.showSnackbar("Данные успешно сохранены", "success");
      }
    } catch (error: any) {
      runInAction(() => {
        this.application = previousState;
      });

      this.rootStore.errorStore.setError("updateApplication", error.message || "Ошибка сохранения");
      this.rootStore.uiStore.showSnackbar("Ошибка сохранения данных", "error");
    } finally {
      runInAction(() => {
        this.isSaving = false;
      });
    }
  }

  async updateCustomer(customerData: Customer) {
    if (!customerData || this.isSaving) return;

    runInAction(() => {
      this.isSaving = true;
    });

    this.rootStore.errorStore.clearError("updateCustomer");

    const previousState = this.customer ? { ...this.customer } : null;

    try {
      runInAction(() => {
        this.customer = customerData;
        if (this.application) {
          this.application.customer = customerData;
        }
      });

      const response = await updateCustomer(customerData);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Ошибка обновления данных заказчика");
      }

      runInAction(() => {
        this.lastUpdated = new Date();
      });

      this.rootStore.uiStore.showSnackbar("Данные заказчика успешно сохранены", "success");
    } catch (error: any) {
      runInAction(() => {
        if (previousState) {
          this.customer = previousState;
          if (this.application) {
            this.application.customer = previousState;
          }
        }
      });

      this.rootStore.errorStore.setError("updateCustomer", error.message || "Ошибка сохранения");
      this.rootStore.uiStore.showSnackbar("Ошибка сохранения данных заказчика", "error");
    } finally {
      runInAction(() => {
        this.isSaving = false;
      });
    }
  }

  async uploadDocument(file: File, documentType: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Uploading document:", file.name, documentType);
  }

  clearDocsIds() {
    this.checkedDocs = []
  }

  async signContract() {
    // Placeholder for contract signing logic
    console.log("Contract signing not implemented yet");
  }

  async uploadPaymentProof(file: File) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Uploading payment proof:", file.name);
      this.rootStore.uiStore.showSnackbar("Подтверждение оплаты загружено", "success");
    } catch (error) {
      this.rootStore.uiStore.showSnackbar("Ошибка загрузки подтверждения", "error");
    }
  }

  async signCompletionAct() {
    // Placeholder for completion act signing logic
    console.log("Completion act signing not implemented yet");
  }

  async downloadFile(idFile: number, fileName: string) {
    try {
      const response = await downloadFile(idFile);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const byteCharacters = atob(response.data.file_contents);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const mimeType = response.data.content_type || "application/octet-stream";
        const fileNameBack = response.data.file_download_name;

        let url = "";

        if (
          fileNameBack.endsWith(".jpg") ||
          fileNameBack.endsWith(".jpeg") ||
          fileNameBack.endsWith(".png")
        ) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: mimeType });
            url = window.URL.createObjectURL(blob);
            newWindow.document.write(`<img src="${url}" />`);
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error("Не удалось открыть новое окно. Возможно, оно было заблокировано.");
          }
        } else if (fileNameBack.endsWith(".pdf")) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: "application/pdf" });
            url = window.URL.createObjectURL(blob);
            newWindow.location.href = url;
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error("Не удалось открыть новое окно. Возможно, оно было заблокировано.");
          }
        }

        const blob = new Blob([byteArray], { type: mimeType });
        url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", response.data.file_download_name || fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error();
      }
    } catch (err) {
      this.rootStore.uiStore.showSnackbar("Не получилось скачать файл", "error");
    }
  }

  clear() {
    this.applicationId = 0;
    this.application = null;
    this.applicationMain = null;
    this.customer = null;
    this.documents = [];
    this.allDocs = [];
    this.payments = [];
    this.outcomeDocs = [];
    this.districts = [];
    this.tags = [];
    this.checkedDocs = [];
    this.isLoading = false;
    this.isSaving = false;
    this.lastUpdated = null;
    this.optimisticUpdates.clear();
    this.openPanelUploadDoc = false;
    this.uplId = 0;
    this.serviceDocId = 0;
    this.isOpenFileView = false;
    this.fileType = "";
    this.fileUrl = null;
  }
}