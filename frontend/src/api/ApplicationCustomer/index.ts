import http from "api/https";
import { ApplicationCustomer } from "constants/ApplicationCustomer";

export const createApplicationCustomer = (data: ApplicationCustomer): Promise<any> => {
  return http.post(`/api/v1/ApplicationCustomer/Create`, data);
};

export const deleteApplicationCustomer = (id: number): Promise<any> => {
  return http.remove(`/api/v1/ApplicationCustomer/Delete?id=${id}`, {});
};

export const getApplicationCustomer = (id: number): Promise<any> => {
  return http.get(`/api/v1/ApplicationCustomer/GetOneById?id=${id}`);
};

export const getApplicationCustomers = (): Promise<any> => {
  return http.get("/api/v1/ApplicationCustomer/GetAll");
};

export const updateApplicationCustomer = (data: ApplicationCustomer): Promise<any> => {
  return http.put(`/api/v1/ApplicationCustomer/Update`, data);
};


export const getApplicationCustomersByApplicationId = (applicationId: number): Promise<any> => {
  return http.get(`/api/v1/ApplicationCustomer/GetByApplicationId?ApplicationId=${applicationId}`);
};
