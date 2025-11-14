import http from "api/https";
import { ApplicationPayer } from "constants/ApplicationPayer";

export const createApplicationPayer = (data: ApplicationPayer): Promise<any> => {
  return http.post(`/api/v1/ApplicationPayer/Create`, data);
};

export const deleteApplicationPayer = (id: number): Promise<any> => {
  return http.remove(`/api/v1/ApplicationPayer/Delete?id=${id}`, {});
};

export const getApplicationPayer = (id: number): Promise<any> => {
  return http.get(`/api/v1/ApplicationPayer/GetOneById?id=${id}`);
};

export const getApplicationPayers = (): Promise<any> => {
  return http.get("/api/v1/ApplicationPayer/GetAll");
};

export const addPayerToApplication = (payerId: number, applicationId: number): Promise<any> => {
  return http.get(`/api/v1/ApplicationPayer/AddPayerToApplication?applicationId=${applicationId}&payerId=${payerId}`);
};

export const updateApplicationPayer = (data: ApplicationPayer): Promise<any> => {
  return http.put(`/api/v1/ApplicationPayer/Update`, data);
};


export const getApplicationPayersByApplicationId = (applicationId: number): Promise<any> => {
  return http.get(`/api/v1/ApplicationPayer/GetByApplicationId?ApplicationId=${applicationId}`);
};
