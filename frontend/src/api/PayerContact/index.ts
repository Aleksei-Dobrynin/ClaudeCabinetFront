import http from "api/https";
import { PayerContact } from "constants/PayerContact";

export const createPayerContact = (data: PayerContact): Promise<any> => {
  return http.post(`/api/v1/PayerContact/Create`, data);
};

export const deletePayerContact = (id: number): Promise<any> => {
  return http.remove(`/api/v1/PayerContact/Delete?id=${id}`, {});
};

export const getPayerContact = (id: number): Promise<any> => {
  return http.get(`/api/v1/PayerContact/GetOneById?id=${id}`);
};

export const getPayerContacts = (): Promise<any> => {
  return http.get("/api/v1/PayerContact/GetAll");
};

export const updatePayerContact = (data: PayerContact): Promise<any> => {
  return http.put(`/api/v1/PayerContact/Update`, data);
};


export const getPayerContactsByPayerId = (payerId: number): Promise<any> => {
  return http.get(`/api/v1/PayerContact/GetByPayerId?PayerId=${payerId}`);
};
