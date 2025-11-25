import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { downloadFile, downloadFileV2 } from "api/MainBackAPI";

class NewStore {
  idFile = 0;
  fileName = "";
  constructor() {
    makeAutoObservable(this);
  }

  setFile(idFile: number, fileName: string) {
    this.idFile = idFile;
    this.fileName = fileName;
  }

  async downloadFile() {
    try {
      MainStore.changeLoader(true);
      const response = await downloadFileV2(this.idFile);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Bad status: ${response.status}`);
      }
      const blob: Blob = response.data;
      const contentDisposition = response.headers["content-disposition"];
      let finalFileName = this.fileName;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) {
          finalFileName = decodeURIComponent(match[1]);
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", finalFileName || "file");
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  clearStore() {
    runInAction(() => {
      this.idFile = 0;
      this.fileName = "";
    });
  }
}

export default new NewStore();
