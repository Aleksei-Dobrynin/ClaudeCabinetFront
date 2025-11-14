import { makeObservable, runInAction, observable } from "mobx";
import i18n from "i18next";
import dayjs, { Dayjs } from "dayjs";

import MainStore from "MainStore";
import BaseStore from 'core/stores/BaseStore';
import { getDocumentByGuid } from "api/Application";
import { FileSign } from "constants/Application";


interface ApplicationResponse {
  id: number;
}

class ApplicationStore extends BaseStore {
  @observable id: number = 0
  @observable comment: string = ""
  @observable file_name: string = ""
  @observable status_name: string = ""
  @observable file_doc_name: string = ""
  @observable signs: FileSign[] = []

  @observable hasDocument: boolean = false;


  constructor() {
    super();
    makeObservable(this);
  }

  clearStore() {
    super.clearStore();
    runInAction(() => {
      this.id = 0
      this.comment = ""
      this.file_name = ""
      this.status_name = ""
      this.file_doc_name = ""
    });
  }

  async doLoad(guid: string) {
    await this.loadDocument(guid);
  }

  loadDocument = async (guid: string) => {
    try {
      MainStore.changeLoader(true)
      const response = await getDocumentByGuid(guid)
      if ((response?.status === 200 || response?.status === 201) && response?.data) {
        this.hasDocument = true;
        this.id = response.data.id
        this.file_name = response.data.file_name
        this.status_name = response.data.status_name
        this.file_doc_name = response.data.file_doc_name
        this.signs = response.data.signs
      } else {
        throw new Error();
      }
    } catch {
      this.hasDocument = false;
    } finally {
      MainStore.changeLoader(false)
    }
  };
}

export default new ApplicationStore();