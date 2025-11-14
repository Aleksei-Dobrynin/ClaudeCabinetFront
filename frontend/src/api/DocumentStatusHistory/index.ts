import http from "api/https";
import { DocumentStatusHistory } from "constants/DocumentStatusHistory";

export const createDocumentStatusHistory = (data: DocumentStatusHistory): Promise<any> => {
  return http.post(`/api/v1/DocumentStatusHistory/Create`, data);
};

export const deleteDocumentStatusHistory = (id: number): Promise<any> => {
  return http.remove(`/api/v1/DocumentStatusHistory/Delete?id=${id}`, {});
};

export const getDocumentStatusHistory = (id: number): Promise<any> => {
  return http.get(`/api/v1/DocumentStatusHistory/GetOneById?id=${id}`);
};

export const getDocumentStatusHistories = (): Promise<any> => {
  return http.get("/api/v1/DocumentStatusHistory/GetAll");
};

export const updateDocumentStatusHistory = (data: DocumentStatusHistory): Promise<any> => {
  return http.put(`/api/v1/DocumentStatusHistory/Update`, data);
};


