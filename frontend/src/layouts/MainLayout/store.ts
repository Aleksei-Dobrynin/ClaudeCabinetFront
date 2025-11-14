import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18n";
import MainStore from "../../MainStore";
import { getMyNotificationLogs, clearNotifications, clearNotification, getCommonSettings } from "../../api/NotificationLog";
import { NotificationLog } from "../../constants/NotificationLog";

interface EmployeeResponse {
  last_name: string;
  first_name: string;
}

class NewStore {
  drawerOpened = true;
  notifications: NotificationLog[] = [];
  curentUserName = '';
  last_name = '';
  employee_id = 0;
  user_id = 0;
  first_name = '';
  head_of_structures = [];
  openPanel = false;
  open = false; // Menu open state
  selectedIndex = 0; // Index of the selected list item
  isSuperAdmin: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      // Reset or clear state as needed
    });
  }

  async getNotifications() {
    try {
      const response = await getMyNotificationLogs();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.notifications = response.data;
        });
      } else {
        throw new Error('Failed to load notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      MainStore.setSnackbar(i18n.t('message:cannotLoadNotifications'), 'error');
    }
  }

  async getCommonSettings() {
    try {
      const response = await getCommonSettings();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          MainStore.commonSettings = response.data;
          MainStore.isCommonCabinet = response.data?.find(x => x.code === "small_cabinet")?.value === "true"
        });
      } else {
        throw new Error('Failed to load notifications');
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t('message:cannotLoadNotifications'), 'error');
    }
  }
  
  async clearAllNotifies() {
    try {
      MainStore.changeLoader(true);
      const response = await clearNotifications();
      console.log('clearAllNotifies response:', response);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        await this.getNotifications(); // Refresh notifications after clearing
      } else {
        throw new Error('Failed to clear notifications');
      }
    } catch (err) {
      console.error('Error clearing notifications:', err);
      MainStore.setSnackbar(i18n.t('message:somethingWentWrong'), 'error');
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async clearNotify(id: number) {
    try {
      MainStore.changeLoader(true);
      const response = await clearNotification(id);
      console.log('clearNotify response:', response);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        await this.getNotifications(); // Refresh notifications after clearing
      } else {
        throw new Error('Failed to clear notification');
      }
    } catch (err) {
      console.error('Error clearing notification:', err);
      MainStore.setSnackbar(i18n.t('message:somethingWentWrong'), 'error');
    } finally {
      MainStore.changeLoader(false);
    }
  }

  // Method to toggle the menu open state
  setOpen(isOpen: boolean) {
    this.open = isOpen;
  }

  // Method to set the selected index
  setSelectedIndex(index: number) {
    this.selectedIndex = index;
  }

  // Method to toggle the drawer state
  changeDrawer() {
    this.drawerOpened = !this.drawerOpened;
  }
}

export default new NewStore();