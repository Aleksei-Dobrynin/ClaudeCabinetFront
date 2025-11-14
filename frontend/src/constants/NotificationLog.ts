import { Dayjs } from "dayjs";

export type NotificationLog = {
  
  id: number;
  text: string;
  title: string;
  applicationId: number;
  contact: string;
  dateSend: string;
  rContactTypeId: string;
};


export type NotificationLogCreateModel = {
  
  id: number;
  text: string;
  title: string;
  applicationId: number;
  contact: string;
  dateSend: string;
  rContactTypeId: string;
};
