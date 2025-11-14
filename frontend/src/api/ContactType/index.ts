import http from "api/https";
import httpBga from "api/httpsBga";
import { ContactTypeCreateModel } from "constants/ContactType";

export const getContactTypes = (): Promise<any> => {
  return http.get("/api/v1/MainBackAPI/Contact_type/GetAll");
};

export const getContactType = (id: number): Promise<any> => {
  return http.get(`/api/v1/ContactType/GetOneById?id=${id}`);
};

export const createContactType = (data: ContactTypeCreateModel): Promise<any> => {
  return http.post(`/api/v1/ContactType/Create`, data);
};

export const updateContactType = (data: ContactTypeCreateModel): Promise<any> => {
  return http.put(`/api/v1/ContactType/Update`, data);
};

export const deleteContactType = (id: number): Promise<any> => {
  return http.remove(`/api/v1/ContactType/Delete?id=${id}`, {});
};
