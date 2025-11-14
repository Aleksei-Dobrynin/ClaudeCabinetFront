import { Dayjs } from "dayjs";

export type NotificationTemplate = {
  
  id: number;
  contactTypeId: number;
  code: string;
  subject: string;
  body: string;
  placeholders: string;
  link: string;
};


export type NotificationTemplateCreateModel = {
  
  id: number;
  contactTypeId: number;
  code: string;
  subject: string;
  body: string;
  placeholders: string;
  link: string;
};
