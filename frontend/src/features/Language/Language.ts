import { Dayjs } from "dayjs";

export type Language = {
  
  name: string;
  nameKg: string;
  descriptionKg: string;
  textColor: string;
  backgroundColor: string;
  description: string;
  code: string;
  isdefault: boolean;
  queuenumber: number;
  id: number;
};


export type LanguageCreateModel = {
  
  name: string;
  nameKg: string;
  descriptionKg: string;
  textColor: string;
  backgroundColor: string;
  description: string;
  code: string;
  isdefault: boolean;
  queuenumber: number;
  id: number;
};
