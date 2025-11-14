import http from "api/https";
import { SDocumenttemplatetranslation } from "constants/SDocumenttemplatetranslation";

export const createSDocumenttemplatetranslation = (data: SDocumenttemplatetranslation): Promise<any> => {
  return http.post(`/api/v1/SDocumenttemplatetranslation/Create`, data);
};

export const deleteSDocumenttemplatetranslation = (id: number): Promise<any> => {
  return http.remove(`/api/v1/SDocumenttemplatetranslation/Delete?id=${id}`, {});
};

export const getSDocumenttemplatetranslation = (id: number): Promise<any> => {
  return http.get(`/api/v1/SDocumenttemplatetranslation/GetOneById?id=${id}`);
};

export const getSDocumenttemplatetranslations = (): Promise<any> => {
  return http.get("/api/v1/SDocumenttemplatetranslation/GetAll");
};

export const updateSDocumenttemplatetranslation = (data: SDocumenttemplatetranslation): Promise<any> => {
  return http.put(`/api/v1/SDocumenttemplatetranslation/Update`, data);
};


export const getSDocumenttemplatetranslationsByIddocumenttemplate = (iddocumenttemplate: number): Promise<any> => {
  return http.get(`/api/v1/SDocumenttemplatetranslation/GetByIddocumenttemplate?Iddocumenttemplate=${iddocumenttemplate}`);
};
