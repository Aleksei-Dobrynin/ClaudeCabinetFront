import { Dayjs } from "dayjs";

export type ApplicationPayer = {
  
  id: number;
  okpo: string;
  postalCode: string;
  ugns: string;
  regNumber: string;
  lastName: string;
  firstName: string;
  secondName: string;
  applicationId: number;
  typeOrganizationId: number;
  fullName: string;
  address: string;
  director: string;
  pin: string;
  bik?: string;
  account_number?: string;
  bank_name: string;
};


export type ApplicationPayerCreateModel = {
  
  id: number;
  okpo: string;
  postalCode: string;
  ugns: string;
  regNumber: string;
  lastName: string;
  firstName: string;
  secondName: string;
  applicationId: number;
  typeOrganizationId: number;
  fullName: string;
  address: string;
  director: string;
  pin: string;
  bik?: string;
  account_number?: string;
  bank_name: string;
};
