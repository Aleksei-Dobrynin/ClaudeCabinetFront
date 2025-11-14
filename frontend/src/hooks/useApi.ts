import { useState, useCallback } from 'react';
import MainStore from 'MainStore';
import i18n from 'i18next';

/**
 * Custom hook for making API calls with loading and error handling
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Execute an API call with loading state and error handling
   * @param apiCall - The API function to call
   * @param onSuccess - Callback for successful response
   * @param onError - Optional custom error handler
   */
  const callApi = useCallback(async <T>(
    apiCall: () => Promise<any>,
    onSuccess: (data: T) => void,
    onError?: (error: any) => void
  ) => {
    try {
      setLoading(true);
      MainStore.changeLoader(true);
      setError(null);

      const response = await apiCall();

      if (response?.status === 200 || response?.status === 201) {
        onSuccess(response.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      setError(i18n.t("message:somethingWentWrong"));

      if (onError) {
        onError(err);
      } else {
        MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      }
    } finally {
      setLoading(false);
      MainStore.changeLoader(false);
    }
  }, []);

  /**
   * Show a success snackbar message
   */
  const showSuccess = useCallback((message: string) => {
    MainStore.setSnackbar(message, "success");
  }, []);

  /**
   * Show an error dialog
   */
  const showError = useCallback((message: string) => {
    MainStore.openErrorDialog(message);
  }, []);

  /**
   * Show a confirmation dialog
   */
  const showConfirmation = useCallback((
    message: string,
    yesLabel: string,
    noLabel: string,
    onConfirm: Function,
    onCancel: Function = () => MainStore.onCloseConfirm()
  ) => {
    MainStore.openErrorConfirm(
      message,
      yesLabel,
      noLabel,
      onConfirm,
      onCancel
    );
  }, []);

  return {
    loading,
    error,
    callApi,
    showSuccess,
    showError,
    showConfirmation
  };
}