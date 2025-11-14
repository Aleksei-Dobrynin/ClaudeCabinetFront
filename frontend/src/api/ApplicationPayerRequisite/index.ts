import http from "api/https";
import { ApplicationPayerRequisite } from "constants/ApplicationPayerRequisite";

export const createApplicationPayerRequisite = (data: ApplicationPayerRequisite): Promise<any> => {
  return http.post(`/api/v1/ApplicationPayerRequisite/Create`, data);
};

export const deleteApplicationPayerRequisite = (id: number): Promise<any> => {
  return http.remove(`/api/v1/ApplicationPayerRequisite/Delete?id=${id}`, {});
};

export const getApplicationPayerRequisite = (id: number): Promise<any> => {
  return http.get(`/api/v1/ApplicationPayerRequisite/GetOneById?id=${id}`);
};

export const getApplicationPayerRequisites = (): Promise<any> => {
  return http.get("/api/v1/ApplicationPayerRequisite/GetAll");
};

export const updateApplicationPayerRequisite = (data: ApplicationPayerRequisite): Promise<any> => {
  return http.put(`/api/v1/ApplicationPayerRequisite/Update`, data);
};


export const getApplicationPayerRequisitesByApplicationPayerId = (applicationPayerId: number): Promise<any> => {
  return http.get(`/api/v1/ApplicationPayerRequisite/GetByApplicationPayerId?ApplicationPayerId=${applicationPayerId}`);
};
