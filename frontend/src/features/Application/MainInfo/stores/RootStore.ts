// src/stores/RootStore.ts
import { ApplicationStore } from './ApplicationStore';
import { UIStore } from './UIStore';
import { ErrorStore } from './ErrorStore';

export class RootStore {
  applicationStore: ApplicationStore;
  uiStore: UIStore;
  errorStore: ErrorStore;

  constructor() {
    this.errorStore = new ErrorStore(this);
    this.applicationStore = new ApplicationStore(this);
    this.uiStore = new UIStore(this);
  }
}

export const rootStore = new RootStore();

