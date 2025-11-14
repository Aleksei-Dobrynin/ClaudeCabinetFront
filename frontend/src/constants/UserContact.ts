import { Dayjs } from "dayjs";

export type UserContact = {
  
  id: number;
  rTypeId: number;
  rTypeName: string;
  value: string;
  allowNotification: boolean;
  customerId: number;
  userId: number;
};


export type UserContactCreateModel = {
  
  id: number;
  rTypeId: number;
  rTypeName: string;
  value: string;
  allowNotification: boolean;
  customerId: number;
  userId: number;
};
