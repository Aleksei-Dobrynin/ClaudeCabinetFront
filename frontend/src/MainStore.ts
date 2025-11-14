import { SnackbarOrigin } from "@mui/material";
import i18n from "i18n";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import printJS from "print-js";
import pages, { icons } from "./menu-items/pages";
import { User, Organization } from "constants/User";
import { getMyInfo, getUser } from "api/User";
import { getMyCompany } from "api/Customer";

class NewStore {
  loader_counter = 0;
  loader = false;
  openSnackbar = false;
  autoHideDuration = 3000;
  positionSnackbar: SnackbarOrigin = { vertical: "bottom", horizontal: "center" };
  snackbarMessage = "";
  snackbarSeverity: "success" | "info" | "warning" | "error" = "success";
  alert = {
    messages: [],
    titles: [],
  };
  confirm = {
    errorMessage: [],
    alertYesNo: [],
    bodies: [],
    acceptBtnColor: [],
    cancelBtnColor: [],
    acceptBtnCustomIcon: [],
    cancelBtnCustomIcon: [],
    cancelBtn: [],
    acceptBtn: [],
    onCloseYes: [],
    onCloseNo: [],
    isDeleteReason: [],
  };
  commonSettings = [];
  isCommonCabinet = false;
  digitalSign = {
    open: false,
    fileIds: [],
    applicationId: 0,
    onCloseYes: null,
    onCloseNo: null,
  };
  currentUserPin: string = "";
  showProfileHint: boolean = false;
  showProfileField: boolean = false;

  myCompanies: Organization[] = [];
  myCompany: Organization = null;
  openSelectCompany = false;
  error = {
    openError403: { error: false, message: "" },
    openError422: { error: false, message: "" },
  };
  myRoles: string[] = [];

  currentUser: User = null;

  get menu() {
    return [
      // {
      //   id: "Settings",
      //   title: i18n.t("label:menu.settings"),
      //   type: "item",
      //   icon: icons.IconDeviceLaptop,
      //   url: "/user/Settings",
      // },

      {
        id: "ApplicationAll",
        title: i18n.t("label:menu.applicationsInProgress"),
        type: "item",
        icon: icons.IconDeviceLaptop,
        url: "/user/ApplicationAll",
        className: 'menu-item-in-progress'
      },
      {
      id: "ApplicationDrafts",
      title: "Черновики",
      type: "item",
      icon: icons.IconDeviceLaptop,
      url: "/user/ApplicationDrafts",
      className: 'menu-item-in-progress'
    },
    {
        id: "ApplicationNeedAction",
        title: i18n.t("label:menu.applicationsNeedAction"),
        type: "item",
        icon: icons.IconDeviceLaptop,
        url: "/user/ApplicationNeedAction",
      },
      {
        id: "ApplicationDone",
        title: i18n.t("label:menu.applicationsCompleted"),
        type: "item",
        icon: icons.IconDeviceLaptop,
        url: "/user/ApplicationDone",
      },
      {
        id: "MyArchiveApplications",
        title: i18n.t("label:menu.archiveApplications"),
        type: "item",
        icon: icons.IconDeviceLaptop,
        url: "/user/MyArchiveApplications",
        className: 'menu-item-archive'
      },
      {
        id: "HistoryTable",
        title: i18n.t("label:menu.applicationHistory"),
        type: "item",
        icon: icons.IconDeviceLaptop,
        url: "/user/HistoryTable",
        className: 'menu-item-history'
      },
    ];
  }

  menuHeader = [

  ];

  constructor() {
    makeAutoObservable(this);
  }

  setOpenError403 = (flag: boolean, message?: string) => {
    this.error.openError403.error = flag;
    if (flag === false) {
      this.error.openError403.message = "";
    } else {
      this.error.openError403.message = message;
    }
  };

  setOpenError422 = (flag: boolean, message?: string) => {
    this.error.openError422.error = flag;
    if (flag === false) {
      this.error.openError422.message = "";
    } else {
      this.error.openError422.message = message;
    }
  };

  logoutNavigate = () => {
    this.myCompany = null;
    this.myCompanies = [];
    this.currentUser = null;
    this.openSelectCompany = false;

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  };

  loadMyCompanies = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getMyCompany();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.myCompanies = response.data;
        if (this.myCompanies.length === 1) {
          this.myCompany = this.myCompanies[0];
          this.openSelectCompany = false;
        } else if (this.myCompanies.length > 1) {
          this.openSelectCompany = true;
        }
        var physicalCustomer = this.myCompanies.find(c => c.isPhysical && c.id == this.currentUser.companyId);
        if (physicalCustomer && (physicalCustomer.passport_series == null ||
          physicalCustomer.passport_issued_date == null ||
          physicalCustomer.passport_whom_issued == null)) {
          this.showProfileHint = true;
          this.showProfileField = true;
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  changeSnackbar = (flag: boolean) => {
    this.openSnackbar = flag;
    if (flag === false) {
      this.snackbarMessage = "";
      this.snackbarSeverity = "success";
      this.autoHideDuration = 3000;
    }
  };

  setSnackbar(
    message: string,
    severity: "success" | "info" | "warning" | "error" = "success",
    position?: SnackbarOrigin
  ) {
    this.openSnackbar = true;
    this.snackbarMessage = message;
    this.snackbarSeverity = severity;
    if (position) {
      this.positionSnackbar = position;
    }
  }

openErrorDialog = (message: string, title?: string) => {
  // Предотвращаем дубликаты
  const isDuplicate = this.alert.messages.some(msg => msg === message);
  if (!isDuplicate) {
    this.alert.messages.push(message);
    if (title) this.alert.titles.push(title);
  }
};

  openDigitalSign = (
    fileIds: number[],
    applicationId: number,
    yesCallback: any,
    noCallback: any
  ) => {
    this.digitalSign.open = true;
    this.digitalSign.fileIds = fileIds;
    this.digitalSign.applicationId = applicationId;
    this.digitalSign.onCloseYes = yesCallback;
    this.digitalSign.onCloseNo = noCallback;
  };

  onCloseDigitalSign = () => {
    this.digitalSign.open = false;
    this.digitalSign.onCloseYes = null;
    this.digitalSign.onCloseNo = null;
    this.digitalSign.fileIds = [];
    this.digitalSign.applicationId = 0;
    this.currentUserPin = "";
  };

  openErrorConfirm = (
    message: string,
    yesLabel: string,
    noLabel: string,
    yesCallback: any,
    noCallback: any,
    yesIcon?: any,
    noIcon?: any,
    yesColor?: string,
    noColor?: string,
    isDeleteReason?: boolean
  ) => {
    this.confirm.errorMessage.push(message);
    this.confirm.acceptBtn.push(yesLabel);
    this.confirm.cancelBtn.push(noLabel);
    this.confirm.onCloseYes.push(yesCallback);
    this.confirm.onCloseNo.push(noCallback);
    this.confirm.acceptBtnColor.push(yesColor);
    this.confirm.cancelBtnColor.push(noColor);
    this.confirm.acceptBtnCustomIcon.push(yesIcon);
    this.confirm.cancelBtnCustomIcon.push(noIcon);
    this.confirm.isDeleteReason.push(isDeleteReason);
  };

  onCloseAlert = () => {
    if (this.alert.messages.length > 0) this.alert.messages.shift();
    if (this.alert.titles.length > 0) this.alert.titles.shift();
  };

  onCloseConfirm = () => {
    if (this.confirm.errorMessage.length > 0) {
      this.confirm.errorMessage.shift();
      this.confirm.acceptBtn.shift();
      this.confirm.cancelBtn.shift();
      this.confirm.onCloseYes.shift();
      this.confirm.onCloseNo.shift();
      this.confirm.acceptBtnColor.shift();
      this.confirm.cancelBtnColor.shift();
      this.confirm.acceptBtnCustomIcon.shift();
      this.confirm.cancelBtnCustomIcon.shift();
    }
  };

  getCurrentUserInfo = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getMyInfo();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.currentUser = response.data;
        this.currentUserPin = response.data.pin;
        await this.loadMyCompanies();
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  selectCurrentCompany = (company: Organization) => {
    this.myCompany = company;
    this.openSelectCompany = false;
  }

  changeCurrentuserPin = (pin: string) => {
    this.currentUserPin = pin;
  }

  changeLoader(flag: boolean) {
    if (flag) {
      this.loader_counter += 1;
    } else {
      this.loader_counter -= 1;
    }
    if (this.loader_counter <= 0) {
      this.loader = false;
      this.loader_counter = 0;
    } else this.loader = true;
  }
}

const MainStore = new NewStore();
export default MainStore;