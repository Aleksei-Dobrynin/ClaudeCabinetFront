import http from "api/https";
import { ApplicationStatusHistory } from "constants/ApplicationStatusHistory";

export const createApplicationStatusHistory = (data: ApplicationStatusHistory): Promise<any> => {
  return http.post(`/api/v1/ApplicationStatusHistory/Create`, data);
};

export const deleteApplicationStatusHistory = (id: number): Promise<any> => {
  return http.remove(`/api/v1/ApplicationStatusHistory/Delete?id=${id}`, {});
};

export const getApplicationStatusHistory = (id: number): Promise<any> => {
  return http.get(`/api/v1/ApplicationStatusHistory/GetOneById?id=${id}`);
};

export const getApplicationStatusHistories = (): Promise<any> => {
  return http.get("/api/v1/ApplicationStatusHistory/GetAll");
};

export const updateApplicationStatusHistory = (data: ApplicationStatusHistory): Promise<any> => {
  return http.put(`/api/v1/ApplicationStatusHistory/Update`, data);
};


export const getApplicationStatusHistoriesByApplicationId = (applicationId: number): Promise<any> => {
  return http.get(`/api/v1/ApplicationStatusHistory/GetByApplicationId?ApplicationId=${applicationId}`);
};
