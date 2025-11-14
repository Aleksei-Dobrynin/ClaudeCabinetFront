import http from "api/https";
import { ArchObjectTag } from "constants/ArchObjectTag";

export const createArchObjectTag = (data: ArchObjectTag): Promise<any> => {
  return http.post(`/api/v1/ArchObjectTag/Create`, data);
};

export const deleteArchObjectTag = (id: number): Promise<any> => {
  return http.remove(`/api/v1/ArchObjectTag/Delete?id=${id}`, {});
};

export const getArchObjectTag = (id: number): Promise<any> => {
  return http.get(`/api/v1/ArchObjectTag/GetOneById?id=${id}`);
};

export const getArchObjectTags = (): Promise<any> => {
  return http.get("/api/v1/ArchObjectTag/GetAll");
};

export const updateArchObjectTag = (data: ArchObjectTag): Promise<any> => {
  return http.put(`/api/v1/ArchObjectTag/Update`, data);
};


export const getArchObjectTagsByIdObject = (idObject: number): Promise<any> => {
  return http.get(`/api/v1/ArchObjectTag/GetByIdObject?IdObject=${idObject}`);
};
