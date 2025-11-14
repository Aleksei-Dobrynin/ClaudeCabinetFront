// src/contexts/StoreContext.tsx
import React, { createContext, useContext } from 'react';
import { RootStore } from './RootStore';

const StoreContext = createContext<RootStore | null>(null);

interface StoreProviderProps {
  store: RootStore;
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ store, children }) => {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): RootStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};

export const useApplicationStore = () => {
  const { applicationStore } = useStore();
  return applicationStore;
};

export const useUIStore = () => {
  const { uiStore } = useStore();
  return uiStore;
};

export const useErrorStore = () => {
  const { errorStore } = useStore();
  return errorStore;
};
