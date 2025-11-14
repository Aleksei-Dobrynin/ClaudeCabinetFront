import http from "api/https";
import { SDocumenttemplate } from "constants/SDocumenttemplate";

export const createSDocumenttemplate = (data: SDocumenttemplate): Promise<any> => {
  return http.post(`/api/v1/SDocumenttemplate/Create`, data);
};

export const deleteSDocumenttemplate = (id: number): Promise<any> => {
  return http.remove(`/api/v1/SDocumenttemplate/Delete?id=${id}`, {});
};

export const getSDocumenttemplate = (id: number): Promise<any> => {
  return http.get(`/api/v1/SDocumenttemplate/GetOneById?id=${id}`);
};

export const getSDocumenttemplates = (): Promise<any> => {
  return http.get("/api/v1/SDocumenttemplate/GetAll");
};

export const updateSDocumenttemplate = (data: SDocumenttemplate): Promise<any> => {
  return http.put(`/api/v1/SDocumenttemplate/Update`, data);
};


