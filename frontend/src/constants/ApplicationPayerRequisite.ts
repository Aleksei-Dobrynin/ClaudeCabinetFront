import { Dayjs } from "dayjs";

export type ApplicationPayerRequisite = {
  
  id: number;
  paymentAccount: string;
  bank: string;
  bik: string;
  applicationPayerId: number;
};


export type ApplicationPayerRequisiteCreateModel = {
  
  id: number;
  paymentAccount: string;
  bank: string;
  bik: string;
  applicationPayerId: number;
};
