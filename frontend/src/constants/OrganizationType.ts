import { Dayjs } from "dayjs";

export type OrganizationType = {
  
  id: number;
  descriptionKg: string;
  textColor: string;
  backgroundColor: string;
  name: string;
  description: string;
  code: string;
  nameKg: string;
};


export type OrganizationTypeCreateModel = {
  
  id: number;
  descriptionKg: string;
  textColor: string;
  backgroundColor: string;
  name: string;
  description: string;
  code: string;
  nameKg: string;
};
