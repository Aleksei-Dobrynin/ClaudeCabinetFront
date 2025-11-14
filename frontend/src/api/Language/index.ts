import http from "api/https";
import { Language } from "constants/Language";

export const createLanguage = (data: Language): Promise<any> => {
  return http.post(`/api/v1/Language/Create`, data);
};

export const deleteLanguage = (id: number): Promise<any> => {
  return http.remove(`/api/v1/Language/Delete?id=${id}`, {});
};

export const getLanguage = (id: number): Promise<any> => {
  return http.get(`/api/v1/Language/GetOneById?id=${id}`);
};

export const getLanguages = (): Promise<any> => {
  return http.get("/api/v1/Language/GetAll");
};

export const updateLanguage = (data: Language): Promise<any> => {
  return http.put(`/api/v1/Language/Update`, data);
};


