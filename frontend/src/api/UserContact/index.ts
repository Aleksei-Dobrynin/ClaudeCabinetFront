import http from "api/https";
import { UserContact } from "constants/UserContact";

export const createUserContact = (data: UserContact): Promise<any> => {
  return http.post(`/api/v1/UserContact/Create`, data);
};

export const deleteUserContact = (id: number): Promise<any> => {
  return http.remove(`/api/v1/UserContact/Delete?id=${id}`, {});
};

export const getUserContact = (id: number): Promise<any> => {
  return http.get(`/api/v1/UserContact/GetOneById?id=${id}`);
};

export const getUserContacts = (): Promise<any> => {
  return http.get("/api/v1/UserContact/GetAll");
};

export const updateUserContact = (data: UserContact): Promise<any> => {
  return http.put(`/api/v1/UserContact/Update`, data);
};


