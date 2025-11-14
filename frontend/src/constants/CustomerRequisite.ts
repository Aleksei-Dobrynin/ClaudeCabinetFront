import { Dayjs } from "dayjs";

export type CustomerRequisite = {
  
  id: number;
  paymentAccount: string;
  bank: string;
  bik: string;
  organizationId: number;
};


export type CustomerRequisiteCreateModel = {
  
  id: number;
  paymentAccount: string;
  bank: string;
  bik: string;
  organizationId: number;
};
