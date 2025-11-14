import { makeObservable, observable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";

/**
 * Base Store class that provides common functionality for MobX stores
 */
export default class BaseStore {
  @observable errors: { [key: string]: string } = {};
  @observable loader: boolean = false;

  constructor() {
    makeObservable(this);
  }

  /**
   * Clear store state (to be overridden by child classes)
   */
  clearStore() {
    runInAction(() => {
      this.errors = {};
    });
  }

  /**
   * Validate a specific field (to be implemented by child classes)
   * @param name - Field name
   * @param value - Field value
   */
  async validateField(name: string, value: any): Promise<void> {
    // Default implementation does nothing
    // Child classes should override this method
  }

  /**
   * Handle input change and update corresponding field
   * @param event - The change event from the input
   */
  handleChange(event: { target: { name: string; value: any } }) {
    const { name, value } = event.target;
    (this as any)[name] = value;

    // Call validateField method (which may be overridden by child classes)
    this.validateField(name, value);
  }

  /**
   * Show loading indicator
   */
  showLoader() {
    MainStore.changeLoader(true);
  }

  /**
   * Hide loading indicator
   */
  hideLoader() {
    MainStore.changeLoader(false);
  }

  /**
   * Show success snackbar
   * @param message - Message to display
   */
  showSuccessSnackbar(message: string) {
    MainStore.setSnackbar(message, "success");
  }

  /**
   * Show error snackbar
   * @param message - Message to display
   */
  showErrorSnackbar(message: string = i18n.t("message:somethingWentWrong")) {
    MainStore.setSnackbar(message, "error");
  }

  /**
   * Show confirmation dialog
   * @param message - Confirmation message
   * @param yesLabel - Label for confirm button
   * @param noLabel - Label for cancel button
   * @param yesCallback - Callback when confirmed
   * @param noCallback - Callback when canceled
   */
  showConfirmDialog(
    message: string,
    yesLabel: string,
    noLabel: string,
    yesCallback: Function,
    noCallback: Function = () => MainStore.onCloseConfirm()
  ) {
    MainStore.openErrorConfirm(
      message,
      yesLabel,
      noLabel,
      yesCallback,
      noCallback
    );
  }

  /**
   * Wrap an async API call with proper loading and error handling
   * @param apiCall - The API function to call
   * @param onSuccess - Callback for successful response
   * @param onError - Optional custom error handler
   */
  async apiCall<T>(
    apiCall: () => Promise<any>,
    onSuccess: (data: T) => void,
    onError?: (error: any) => void
  ) {
    try {
      this.showLoader();
      const response = await apiCall();

      if (response?.status === 200 || response?.status === 201) {
        onSuccess(response.data);
      } else {
        throw new Error();
      }
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        this.showErrorSnackbar();
      }
    } finally {
      this.hideLoader();
    }
  }
}