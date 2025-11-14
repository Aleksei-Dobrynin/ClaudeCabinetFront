import http from "api/https";
import { CustomerContact } from "constants/CustomerContact";

export const createCustomerContact = (data: CustomerContact): Promise<any> => {
  return http.post(`/api/v1/CustomerContact/Create`, data);
};

export const deleteCustomerContact = (id: number): Promise<any> => {
  return http.remove(`/api/v1/CustomerContact/Delete?id=${id}`, {});
};

export const getCustomerContact = (id: number): Promise<any> => {
  return http.get(`/api/v1/CustomerContact/GetOneById?id=${id}`);
};

export const getCustomerContacts = (): Promise<any> => {
  return http.get("/api/v1/CustomerContact/GetAll");
};

export const updateCustomerContact = (data: CustomerContact): Promise<any> => {
  return http.put(`/api/v1/CustomerContact/Update`, data);
};


export const getCustomerContactsByOrganizationId = (organizationId: number): Promise<any> => {
  return http.get(`/api/v1/CustomerContact/GetByOrganizationId?OrganizationId=${organizationId}`);
};
