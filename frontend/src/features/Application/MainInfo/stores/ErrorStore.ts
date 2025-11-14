// src/features/Application/MainInfo/store/ErrorStore.ts
import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';

export class ErrorStore {
  rootStore: RootStore;
  
  errors: Record<string, string> = {};
  
  globalError: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {
      rootStore: false
    });
  }
  
  setError(key: string, message: string) {
    this.errors[key] = message;
  }
  
  clearError(key: string) {
    delete this.errors[key];
  }
  setGlobalError(message: string | null) {
    this.globalError = message;
  }
  
  hasError(key: string): boolean {
    return !!this.errors[key];
  }
  
  getError(key: string): string {
    return this.errors[key] || '';
  }
  
  getAllErrors(): Record<string, string> {
    return this.errors;
  }
  get hasGlobalError(): boolean {
    return this.globalError !== null;
  }

  // get hasAnyError(): boolean {
  //   return this.errors.size > 0 || this.globalError !== null;
  // }
  
  clearAllErrors() {
    this.errors = {};
  }
}