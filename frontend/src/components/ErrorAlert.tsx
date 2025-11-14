// src/components/shared/ErrorAlert.tsx
import React from 'react';
// import { AlertCircle, X } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useErrorStore } from '../features/Application/MainInfo/stores/StoreContext';

interface ErrorAlertProps {
  category?: string;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = observer(({ category, onDismiss }) => {
  const errorStore = useErrorStore();
  

  const errorMessage = category
    ? errorStore.getError(category)
    : errorStore.globalError;
  
  if (!errorMessage) return null;
  
  const handleDismiss = () => {
    if (category) {
      errorStore.clearError(category);
    } else {
      errorStore.setGlobalError(null);
    }
    
    if (onDismiss) {
      onDismiss();
    }
  };
  
  return (
    <div className="rounded-md bg-red-50 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          {/* <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" /> */}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-red-800">
            {errorMessage}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <span className="sr-only">Закрыть</span>
              {/* <X className="h-5 w-5" aria-hidden="true" /> */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
