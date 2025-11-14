import { Dayjs } from "dayjs";

export type ApplicationStatus = {
  
  id: number;
  descriptionKg: string;
  textColor: string;
  backgroundColor: string;
  name: string;
  description: string;
  code: string;
  nameKg: string;
};


export type ApplicationStatusCreateModel = {
  
  id: number;
  descriptionKg: string;
  textColor: string;
  backgroundColor: string;
  name: string;
  description: string;
  code: string;
  nameKg: string;
};
