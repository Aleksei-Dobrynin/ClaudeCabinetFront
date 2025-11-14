import http from "api/https";
import { PayerRequisite } from "constants/PayerRequisite";

export const createPayerRequisite = (data: PayerRequisite): Promise<any> => {
  return http.post(`/api/v1/PayerRequisite/Create`, data);
};

export const deletePayerRequisite = (id: number): Promise<any> => {
  return http.remove(`/api/v1/PayerRequisite/Delete?id=${id}`, {});
};

export const getPayerRequisite = (id: number): Promise<any> => {
  return http.get(`/api/v1/PayerRequisite/GetOneById?id=${id}`);
};

export const getPayerRequisites = (): Promise<any> => {
  return http.get("/api/v1/PayerRequisite/GetAll");
};

export const updatePayerRequisite = (data: PayerRequisite): Promise<any> => {
  return http.put(`/api/v1/PayerRequisite/Update`, data);
};


export const getPayerRequisitesByPayerId = (payerId: number): Promise<any> => {
  return http.get(`/api/v1/PayerRequisite/GetByPayerId?PayerId=${payerId}`);
};
