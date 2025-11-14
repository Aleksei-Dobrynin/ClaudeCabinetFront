import { Dayjs } from "dayjs";

export type CustomerContact = {
  
  id: number;
  value: string;
  allowNotification: boolean;
  rTypeId: number;
  organizationId: number;
};


export type CustomerContactCreateModel = {
  
  id: number;
  value: string;
  allowNotification: boolean;
  rTypeId: number;
  organizationId: number;
};
