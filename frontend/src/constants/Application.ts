import { Dayjs } from "dayjs";
import { ArchObject } from "./ArchObject";

export type Application = {
  
  id: number;
  workDescription: string;
  archObjectId: number;
  statusId: number;
  statusCode: string;
  statusName?: string;
  companyId: number;
  rServiceId: number;
  rServiceName: string;
  uniqueCode: string;
  registrationDate: Dayjs;
  deadline: Dayjs;
  number: string;
  comment: string;
  archObjects?: ArchObject[];
  workDocuments?: ApplicationWorkDocumentFromBga[];
  uploadDocuments?: UploadedDocumentFromBga[];
  rejectHtml?: string;
  rejectFileId?: number;
  mainApplication?: any;
  appCabinetUuid?: string;
};


export type ApplicationWorkDocumentFromBga = {
  id: number;
  file_id: number;
  file_name: string;
  comment: string;
  id_type_name: string;
  document_name: string;
  created_at: Dayjs;
  signed_by: string;
  is_signed: boolean;
}

export type UploadedDocumentFromBga = {
  upl_id: number;
  created_at: Dayjs;
  file_id: number;
  service_document_id: number;
  app_doc_id: number;
  app_doc_name: string;
  sign_id: number;
  sign_timestamp: Dayjs;
  employee_name: string;
}


export type ApplicationCreateModel = {
  
  id: number;
  workDescription: string;
  archObjectId?: number;
  statusId: number;
  companyId?: number;
  rServiceId: number;
  rServiceName: string;
  uniqueCode: string;
  registrationDate?: Dayjs;
  lastUpdatedStatus?: Dayjs;
  deadline?: Dayjs;
  number: string;
  comment: string;
  archObjects?: ArchObject[];
  appCabinetUuid?: string;
};

export type ApplicationWorkDocument = {
  id: number;
  comment: string;
  sign: FileSign[];
};

export type FileSign = {
  id: number;
  file_id: number;
  user_full_name: number;
  timestamp: string;
};

