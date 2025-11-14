import http from "api/https";
import { AuthType } from "constants/AuthType";

export const createAuthType = (data: AuthType): Promise<any> => {
  return http.post(`/api/v1/AuthType/Create`, data);
};

export const deleteAuthType = (id: number): Promise<any> => {
  return http.remove(`/api/v1/AuthType/Delete?id=${id}`, {});
};

export const getAuthType = (id: number): Promise<any> => {
  return http.get(`/api/v1/AuthType/GetOneById?id=${id}`);
};

export const getAuthTypes = (): Promise<any> => {
  return http.get("/api/v1/AuthType/GetAll");
};

export const updateAuthType = (data: AuthType): Promise<any> => {
  return http.put(`/api/v1/AuthType/Update`, data);
};


