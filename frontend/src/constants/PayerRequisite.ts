import { Dayjs } from "dayjs";

export type PayerRequisite = {
  
  id: number;
  paymentAccount: string;
  bank: string;
  bik: string;
  payerId: number;
};


export type PayerRequisiteCreateModel = {
  
  id: number;
  paymentAccount: string;
  bank: string;
  bik: string;
  payerId: number;
};
