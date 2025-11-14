import http from "api/https";
import { DocumentStatus } from "constants/DocumentStatus";

export const createDocumentStatus = (data: DocumentStatus): Promise<any> => {
  return http.post(`/api/v1/DocumentStatus/Create`, data);
};

export const deleteDocumentStatus = (id: number): Promise<any> => {
  return http.remove(`/api/v1/DocumentStatus/Delete?id=${id}`, {});
};

export const getDocumentStatus = (id: number): Promise<any> => {
  return http.get(`/api/v1/DocumentStatus/GetOneById?id=${id}`);
};

export const getDocumentStatuses = (): Promise<any> => {
  return http.get("/api/v1/DocumentStatus/GetAll");
};

export const updateDocumentStatus = (data: DocumentStatus): Promise<any> => {
  return http.put(`/api/v1/DocumentStatus/Update`, data);
};


