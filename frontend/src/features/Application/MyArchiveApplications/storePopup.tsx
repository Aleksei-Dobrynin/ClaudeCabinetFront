import { runInAction, makeObservable, observable } from "mobx";

import BaseStore from 'core/stores/BaseStore';
import MainStore from "MainStore";
import { getApplicationByIdMain } from "api/Application";

class ApplicationViewStore extends BaseStore {
  @observable id: number;
  @observable data: any = null; 

  constructor() {
    super()
    makeObservable(this);
  }

  clearStore() {
    super.clearStore()
    runInAction(() => {
      this.data = null; 
    });
  }

  doLoad(id: number) {
    this.id = id
    this.loadApplications()
  }

  loadApplications = async () => {
    this.apiCall(
      () => getApplicationByIdMain(this.id),
      (data) => {
        runInAction(() => {
          this.data = data; 
        });
      }
    );
  };
}

export default new ApplicationViewStore();