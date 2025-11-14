import http from "api/https";
import { OrganizationType } from "constants/OrganizationType";

export const createOrganizationType = (data: OrganizationType): Promise<any> => {
  return http.post(`/api/v1/OrganizationType/Create`, data);
};

export const deleteOrganizationType = (id: number): Promise<any> => {
  return http.remove(`/api/v1/OrganizationType/Delete?id=${id}`, {});
};

export const getOrganizationType = (id: number): Promise<any> => {
  return http.get(`/api/v1/OrganizationType/GetOneById?id=${id}`);
};

export const getOrganizationTypes = (): Promise<any> => {
  return http.get("/api/v1/OrganizationType/GetAll");
};

export const updateOrganizationType = (data: OrganizationType): Promise<any> => {
  return http.put(`/api/v1/OrganizationType/Update`, data);
};


