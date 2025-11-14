import { Dayjs } from "dayjs";

export type Payer = {
  
  id: number;
  okpo: string;
  postalCode: string;
  ugns: string;
  regNumber: string;
  typeOrganizationId: number;
  customerId: number;
  lastName: string;
  firstName: string;
  secondName: string;
  fullName: string;
  address: string;
  director: string;
  pin: string;
};


export type PayerCreateModel = {
  
  id: number;
  okpo: string;
  postalCode: string;
  ugns: string;
  regNumber: string;
  typeOrganizationId: number;
  customerId: number;
  lastName: string;
  firstName: string;
  secondName: string;
  fullName: string;
  address: string;
  director: string;
  pin: string;
};
