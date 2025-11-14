import { Dayjs } from "dayjs";

export type PayerContact = {
  
  id: number;
  value: string;
  allowNotification: boolean;
  rTypeId: number;
  payerId: number;
};


export type PayerContactCreateModel = {
  
  id: number;
  value: string;
  allowNotification: boolean;
  rTypeId: number;
  payerId: number;
};
