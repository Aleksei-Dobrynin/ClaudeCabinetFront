import { Dayjs } from "dayjs";

export type Representative = {
  
  id: number;
  firstName: string;
  secondName: string;
  pin: string;
  companyId: number;
  hasAccess: boolean;
  typeId: number;
  lastName: string;
  phone: string;
  email: string;
};


export type RepresentativeCreateModel = {
  
  id: number;
  firstName: string;
  secondName: string;
  pin: string;
  companyId: number;
  hasAccess: boolean;
  typeId: number;
  lastName: string;
  phone: string;
  email: string;
};
