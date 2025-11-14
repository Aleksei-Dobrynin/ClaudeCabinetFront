import http from "api/https";
import { ApplicationStatus } from "constants/ApplicationStatus";

export const createApplicationStatus = (data: ApplicationStatus): Promise<any> => {
  return http.post(`/api/v1/ApplicationStatus/Create`, data);
};

export const deleteApplicationStatus = (id: number): Promise<any> => {
  return http.remove(`/api/v1/ApplicationStatus/Delete?id=${id}`, {});
};

export const getApplicationStatus = (id: number): Promise<any> => {
  return http.get(`/api/v1/ApplicationStatus/GetOneById?id=${id}`);
};

export const getApplicationStatuses = (): Promise<any> => {
  return http.get("/api/v1/ApplicationStatus/GetAll");
};

export const updateApplicationStatus = (data: ApplicationStatus): Promise<any> => {
  return http.put(`/api/v1/ApplicationStatus/Update`, data);
};


