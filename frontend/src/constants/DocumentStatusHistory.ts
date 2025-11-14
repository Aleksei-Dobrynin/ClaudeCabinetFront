import { Dayjs } from "dayjs";

export type DocumentStatusHistory = {
  
  id: number;
  documentId: number;
  statusId: number;
  description: string;
  oldStatusId: number;
};


export type DocumentStatusHistoryCreateModel = {
  
  id: number;
  documentId: number;
  statusId: number;
  description: string;
  oldStatusId: number;
};
