import http from "api/https";
import { ApplicationPaidInvoice } from "constants/ApplicationPaidInvoice";

export const createApplicationPaidInvoice = (data: ApplicationPaidInvoice): Promise<any> => {
  return http.post(`/api/v1/ApplicationPaidInvoice/Create`, data);
};

export const deleteApplicationPaidInvoice = (id: number): Promise<any> => {
  return http.remove(`/api/v1/ApplicationPaidInvoice/Delete?id=${id}`, {});
};

export const getApplicationPaidInvoice = (id: number): Promise<any> => {
  return http.get(`/api/v1/ApplicationPaidInvoice/GetOneById?id=${id}`);
};

export const getApplicationPaidInvoices = (): Promise<any> => {
  return http.get("/api/v1/ApplicationPaidInvoice/GetAll");
};

export const updateApplicationPaidInvoice = (data: ApplicationPaidInvoice): Promise<any> => {
  return http.put(`/api/v1/ApplicationPaidInvoice/Update`, data);
};


export const getApplicationPaidInvoicesByApplicationId = (applicationId: number): Promise<any> => {
  return http.get(`/api/v1/ApplicationPaidInvoice/GetByApplicationId?ApplicationId=${applicationId}`);
};

export const getApplicationPaidInvoicesByCustomerId = (customerId: number): Promise<any> => {
  return http.get(`/api/v1/ApplicationPaidInvoice/GetByCustomerId?CustomerId=${customerId}`);
};
