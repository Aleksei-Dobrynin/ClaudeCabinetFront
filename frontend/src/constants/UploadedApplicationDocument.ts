import { Dayjs } from "dayjs";

export type UploadedApplicationDocument = {

  id: number;
  hashCode: string;
  hashCodeDate: Dayjs;
  serviceDocumentId: number;
  file_id?: number; //TODO check 
  isSigned?: boolean; //TODO check
  is_signed?: boolean; //TODO check
  is_outcome?: boolean; //TODO check
  fileId: number;
  fileName: string;
  name: string;
  applicationId: number;
  statusId: number;
  is_required?: boolean;
};


export type UploadedApplicationDocumentCreateModel = {

  Id: number;
  HashCode: string;
  HashCodeDate: Dayjs;
  ServiceDocumentId: number;
  FileId: number;
  isSigned: boolean;
  Name: string;
  ApplicationId: number;
  StatusId: number;
};
