import { Dayjs } from "dayjs";

export type RepresentativeContact = {
  
  id: number;
  value: string;
  allowNotification: boolean;
  rTypeId: number;
  representativeId: number;
};


export type RepresentativeContactCreateModel = {
  
  id: number;
  value: string;
  allowNotification: boolean;
  rTypeId: number;
  representativeId: number;
};
