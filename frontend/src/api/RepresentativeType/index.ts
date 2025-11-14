import http from "api/https";
import { RepresentativeType } from "constants/RepresentativeType";

export const createRepresentativeType = (data: RepresentativeType): Promise<any> => {
  return http.post(`/api/v1/RepresentativeType/Create`, data);
};

export const deleteRepresentativeType = (id: number): Promise<any> => {
  return http.remove(`/api/v1/RepresentativeType/Delete?id=${id}`, {});
};

export const getRepresentativeType = (id: number): Promise<any> => {
  return http.get(`/api/v1/RepresentativeType/GetOneById?id=${id}`);
};

export const getRepresentativeTypes = (): Promise<any> => {
  return http.get("/api/v1/RepresentativeType/GetAll");
};

export const updateRepresentativeType = (data: RepresentativeType): Promise<any> => {
  return http.put(`/api/v1/RepresentativeType/Update`, data);
};


