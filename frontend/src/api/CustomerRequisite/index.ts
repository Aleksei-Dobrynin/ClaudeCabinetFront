import http from "api/https";
import { CustomerRequisite } from "constants/CustomerRequisite";

export const createCustomerRequisite = (data: CustomerRequisite): Promise<any> => {
  return http.post(`/api/v1/CustomerRequisite/Create`, data);
};

export const deleteCustomerRequisite = (id: number): Promise<any> => {
  return http.remove(`/api/v1/CustomerRequisite/Delete?id=${id}`, {});
};

export const getCustomerRequisite = (id: number): Promise<any> => {
  return http.get(`/api/v1/CustomerRequisite/GetOneById?id=${id}`);
};

export const getCustomerRequisites = (): Promise<any> => {
  return http.get("/api/v1/CustomerRequisite/GetAll");
};

export const updateCustomerRequisite = (data: CustomerRequisite): Promise<any> => {
  return http.put(`/api/v1/CustomerRequisite/Update`, data);
};


export const getCustomerRequisitesByOrganizationId = (organizationId: number): Promise<any> => {
  return http.get(`/api/v1/CustomerRequisite/GetByOrganizationId?OrganizationId=${organizationId}`);
};
