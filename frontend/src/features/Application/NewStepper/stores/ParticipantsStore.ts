// stores/ParticipantsStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import { createCustomer, getCustomer, updateCustomer } from "api/Customer";
import MainStore from "MainStore";
import { CustomerCreateModel } from "constants/Customer";
import dayjs, { Dayjs } from "dayjs";
import * as yup from 'yup';
import i18n from "i18next";

export interface CustomerData {
  id: number | null;
  pin: string;
  okpo: string | null;
  isPhysical: boolean;
  postalCode: string;
  ugns: string | null;
  regNumber: string | null;
  organizationTypeId: number | null;
  name: string;
  address: string;
  director: string;
  nomer: string | null;
  phone1: string;
  phone2: string | null;
  email: string;
  email_2: string | null;
  identity_document_type_code: string | null;
  isForeign: boolean;
  foreignCountry: number;
  allowNotification: boolean | null;
  payment_account: string | null;
  bank: string | null;
  bik: string | null;
  passport_series: string | null;
  passport_issued_date: null;
  passport_whom_issued: string | null;
  lastName?: string | null;
  firstName?: string | null;
  secondName?: string | null;
}

export class ParticipantsStore {
  rootStore: RootStore;

  // Role selection
  showRoleDialog = true;
  selectedRole: "customer" | "applicant" | null = null;

  // Customer data
  customerData: CustomerData = {
    id: null,
    pin: "",
    okpo: null,
    isPhysical: true,
    postalCode: "",
    ugns: null,
    regNumber: null,
    organizationTypeId: null,
    name: "",
    address: "",
    director: "",
    nomer: null,
    phone1: "",
    phone2: null,
    email: "",
    email_2: null,
    identity_document_type_code: null,
    isForeign: false,
    foreignCountry: 0,
    allowNotification: null,
    payment_account: null,
    bank: null,
    bik: null,
    passport_series: null,
    passport_issued_date: null,
    passport_whom_issued: null,
    lastName: "",
    firstName: "",
    secondName: ""
  };

  isSearching = false;
  searchError: string | null = null;
  errors: Record<string, string> = {};
  isLoading = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setSelectedRole(role: "customer" | "applicant") {
    this.selectedRole = role;
  }

  setCustomerType(isPhysical: boolean) {
    this.customerData.isPhysical = isPhysical;
  }

  updateCustomerData<K extends keyof CustomerData>(field: K, value: CustomerData[K]) {
    this.customerData[field] = value;
    // Clear error when user starts typing
    if (this.errors[field]) {
      delete this.errors[field];
    }

    if (this.customerData.isPhysical && ['firstName', 'lastName', 'secondName'].includes(field as string)) {
      const { lastName = '', firstName = '', secondName = '' } = this.customerData;
      this.customerData.name = `${lastName} ${firstName} ${secondName}`.trim().replace(/\s+/g, ' ');
    }
  }

  private customerSchema = yup.object().shape({
    pin: yup
      .string()
      .required(i18n.t("participants.validation.pinRequired"))
      .test("pin-format", i18n.t("participants.validation.pinFormat"), function (value) {
        const isForeign = this.options.context?.isForeign;
        if (isForeign) return true;
        return /^[0-9]{14}$/.test(value || "");
      }),

    name: yup
      .string()
      .required(i18n.t("participants.validation.nameRequired")),

    phone1: yup
      .string()
      .required(i18n.t("participants.validation.phoneRequired"))
      .test("valid-kg-phone", i18n.t("participants.validation.phoneFormat"), function (value) {
        const digits = (value || '').replace(/\D/g, '');
        return digits.startsWith('996') && digits.length === 12;
      }),

    email: yup
      .string()
      .required(i18n.t("participants.validation.emailRequired"))
      .email(i18n.t("participants.validation.emailFormat")),

    address: yup
      .string()
      .required(i18n.t("participants.validation.addressRequired")),

    director: yup
      .string()
      .when("isPhysical", {
        is: false,
        then: schema => schema.required(i18n.t("participants.validation.directorRequired")),
        otherwise: schema => schema.notRequired(),
      }),
  });

  async loadCustomerData(id: number) {
    this.isLoading = true;
    try {
      const response = await getCustomer(id);
      if ((response?.status === 200 || response?.status === 201) && response.data) {
        runInAction(() => {
          const customer = { ...response.data };

          if (customer.isPhysical && typeof customer.name === 'string') {
            const [lastName = '', firstName = '', secondName = ''] = customer.name.trim().split(/\s+/);
            customer.lastName = lastName;
            customer.firstName = firstName;
            customer.secondName = secondName;
          }

          this.customerData = customer;
        });
        return true;
      }
      return false;
    } catch (error) {
      this.rootStore.showSnackbar(i18n.t("participants.error.customerDataError"), "error");
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async onClickRole() {
    this.showRoleDialog = false;
    if (this.selectedRole === "customer") {
      this.loadCustomerData(MainStore.currentUser?.companyId);
    }
  }

  validate(): boolean {
    try {
      this.customerSchema.validateSync(this.customerData, {
        abortEarly: false,
        context: {
          isForeign: this.customerData.isForeign,
          isPhysical: this.customerData.isPhysical,
        }
      });
      this.errors = {};
      return true;
    } catch (err: any) {
      const errors: Record<string, string> = {};
      if (err.inner) {
        err.inner.forEach((e: yup.ValidationError) => {
          if (e.path) errors[e.path] = e.message;
        });
      }
      this.errors = errors;
      return false;
    }
  }

  async save(): Promise<boolean> {
    if (!this.selectedRole) {
      this.rootStore.showSnackbar(i18n.t("participants.error.selectRole"), "error");
      return false;
    }

    if (!this.validate()) {
      this.rootStore.showSnackbar(i18n.t("participants.error.fillRequiredFields"), "error");
      return false;
    }

    const data: CustomerCreateModel = {
      id: this.customerData.id - 0,
      pin: this.customerData.pin,
      okpo: this.customerData.okpo,
      postalCode: this.customerData.postalCode,
      ugns: this.customerData.ugns,
      regNumber: this.customerData.regNumber,
      organizationTypeId:
        this.customerData.organizationTypeId - 0 === 0
          ? null
          : this.customerData.organizationTypeId - 0,
      name: this.customerData.name,
      address: this.customerData.address,
      director: this.customerData.director,
      nomer: this.customerData.nomer,
      phone1: this.customerData.phone1,
      phone2: this.customerData.phone2,
      email: this.customerData.email,
      requisits: [],
      isForeign: this.customerData.isForeign,
      isPhysical: this.customerData.isPhysical,
      foreignCountry: this.customerData.foreignCountry,
      allowNotification: this.customerData.allowNotification,
      passport_series: this.customerData.passport_series,
      passport_issued_date: dayjs(this.customerData.passport_issued_date),
      passport_whom_issued: this.customerData.passport_whom_issued,
      lastName: this.customerData.lastName,
      firstName: this.customerData.firstName,
      secondName: this.customerData.secondName,
      identity_document_type_code: this.customerData.identity_document_type_code
    };

    try {
      // Save customer data
      if (this.customerData.id === 0 || this.customerData.id === null) {
        const response = await createCustomer(data);
        if ((response?.status === 200 || response?.status === 201) && response.data) {
          runInAction(() => {
            this.customerData.id = response.data.id;
            this.rootStore.companyId = response.data.id;
          });
        } else {
          throw new Error();
        }
      } else {
        const response = await updateCustomer(data);
        if ((response?.status === 200 || response?.status === 201) && response.data) {
          runInAction(() => {
            this.rootStore.companyId = response.data.id;
          });
        } else {
          throw new Error();
        }
      }
      
      this.rootStore.showSnackbar(i18n.t("participants.success.customerDataSaved"), "success");
      return true;
    } catch (error) {
      this.rootStore.showSnackbar(i18n.t("participants.error.customerSaveError"), "error");
      return false;
    }
  }

  loadFromApplication(data: any) {
    if (data && data.companyId) {
      this.loadCustomerData(data.companyId);
      this.showRoleDialog = false;
      this.selectedRole = "customer"; // Assume they are the customer if data exists
    } else {
      // No customer data, show role selection
      this.showRoleDialog = true;
      this.selectedRole = null;
    }
  }

  reset() {
    this.showRoleDialog = true;
    this.selectedRole = null;
    this.customerData = {
      id: null,
      pin: "",
      okpo: null,
      isPhysical: true,
      postalCode: "",
      ugns: null,
      regNumber: null,
      organizationTypeId: null,
      name: "",
      address: "",
      director: "",
      nomer: null,
      phone1: "",
      phone2: null,
      email: "",
      email_2: null,
      identity_document_type_code: null,
      isForeign: false,
      foreignCountry: 0,
      allowNotification: null,
      payment_account: null,
      bank: null,
      bik: null,
      passport_series: null,
      passport_issued_date: null,
      passport_whom_issued: null,
    };
    this.errors = {};
    this.searchError = null;
  }
}