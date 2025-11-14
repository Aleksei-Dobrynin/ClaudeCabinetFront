import { Dayjs } from "dayjs";

export type ApplicationStatusHistory = {
  
  id: number;
  statusId: number;
  oldStatusId: number;
  applicationId: number;
};


export type ApplicationStatusHistoryCreateModel = {
  
  id: number;
  statusId: number;
  oldStatusId: number;
  applicationId: number;
};
