import http from "api/https";
import { Payer } from "constants/Payer";

export const createPayer = (data: Payer): Promise<any> => {
  return http.post(`/api/v1/Payer/Create`, data);
};

export const deletePayer = (id: number): Promise<any> => {
  return http.remove(`/api/v1/Payer/Delete?id=${id}`, {});
};

export const getPayer = (id: number): Promise<any> => {
  return http.get(`/api/v1/Payer/GetOneById?id=${id}`);
};

export const getPayers = (): Promise<any> => {
  return http.get("/api/v1/Payer/GetAll");
};

export const updatePayer = (data: Payer): Promise<any> => {
  return http.put(`/api/v1/Payer/Update`, data);
};


export const getPayersByCustomerId = (customerId: number): Promise<any> => {
  return http.get(`/api/v1/Payer/GetByCustomerId?customerId=${customerId}`);
};
