import { Dayjs } from "dayjs";

export type ApplicationCustomer = {
  
  id: number;
  director: string;
  okpo: string;
  paymentAccount: string;
  postalCode: string;
  ugns: string;
  bank: string;
  bik: string;
  registrationNumber: string;
  identityDocumentTypeId: number;
  organizationTypeId: number;
  pin: string;
  applicationId: number;
  isOrganization: boolean;
  fullName: string;
  address: string;
};


export type ApplicationCustomerCreateModel = {
  
  id: number;
  director: string;
  okpo: string;
  paymentAccount: string;
  postalCode: string;
  ugns: string;
  bank: string;
  bik: string;
  registrationNumber: string;
  identityDocumentTypeId: number;
  organizationTypeId: number;
  pin: string;
  applicationId: number;
  isOrganization: boolean;
  fullName: string;
  address: string;
};
