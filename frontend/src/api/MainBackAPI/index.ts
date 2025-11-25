import http from "api/https";
import { Application } from "constants/Application";
import { API_URL_BGA } from "constants/config";
import { uploaded_application_document, ServiceDocumentDTO } from "./models/upladed_application_document";

//File
export const downloadFile = (id: number): Promise<any> => {
  return http.get(`api/v1/AppFile/DownloadDocument?id=${id}`);
};

// NEW: Потоковая загрузка с прогрессом
export const downloadFileV2 = (id: number, onProgress?: (progress: number) => void): Promise<any> => {
  return http.downloadFileStream(`api/v1/AppFile/DownloadDocumentV2?id=${id}`, onProgress);
};

// NEW: Открытие файла для просмотра (потоковый метод)
export const openFileViewV2 = (id: number, onProgress?: (progress: number) => void): Promise<any> => {
  return http.openFileStream(`api/v1/AppFile/DownloadDocumentV2?id=${id}`, onProgress);
};

export const downloadFileBga = (id: number): Promise<any> => {
  return http.get(`${API_URL_BGA}file/DownloadDocumentFromCabinet?id=${id}`, {},);
};


// TODO check api 
//uploaded_application_document
export const getuploaded_application_documentsBy = (application_document_id: number): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/GetCustomByApplicationId?application_document_id=${application_document_id}`);
};

export const deleteuploaded_application_document = (id: number): Promise<any> => {
  return http.remove(`/api/v1/MainBackAPI/${id}`, {});
};

export const acceptuploaded_application_document = (data: uploaded_application_document): Promise<any> => {
  var item = http.post(`/api/v1/MainBackAPI/AccepDocument`, data);
  return item;
};

export const getServiceDocumentsByIdService = async (serviceId: number): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/ServiceDocument/GetServiceDocumentsByIdService?IdService=${serviceId}`);
};

export const getPaidInvoiceByGuid = (id: number): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/PaidInvoice/GetByApplicationId?id=${id}`);
};

export const getPaidAmmountByGuid = (id: number): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/PaidAmmount/GetByApplicationId?id=${id}`);
};

export const GenerateQr = (applicationId: number, sum :number): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/QRpaiment/GenerateQr?applicationId=${applicationId}&sum=${sum}`);
};