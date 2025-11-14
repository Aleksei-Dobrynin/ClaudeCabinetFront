import http from "api/https";
import { Service } from "../../constants/Service";

export const getServices = (): Promise<any> => {
  return http.get("/api/v1/MainBackAPI/Service/GetAll");
};

export const getService = (id: number): Promise<any> => {
  return http.get(`/api/v1/Service/GetOneById?id=${id}`);
};

export const createService = (data: Service): Promise<any> => {
  return http.post(`/api/v1/Service/Create`, data);
};

export const updateService = (data: Service): Promise<any> => {
  return http.put(`/api/v1/Service/Update`, data);
};

export const deleteService = (id: number): Promise<any> => {
  return http.remove(`/api/v1/Service/Delete?id=${id}`, {});
};
