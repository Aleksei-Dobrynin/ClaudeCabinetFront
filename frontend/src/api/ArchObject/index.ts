import http from "api/https";
import { ArchObject } from "constants/ArchObject";

export const createArchObject = (data: ArchObject): Promise<any> => {
  return http.post(`/api/v1/ArchObject/Create`, data);
};

export const deleteArchObject = (id: number): Promise<any> => {
  return http.remove(`/api/v1/ArchObject/Delete?id=${id}`, {});
};

export const getArchObject = (id: number): Promise<any> => {
  return http.get(`/api/v1/ArchObject/GetOneById?id=${id}`);
};

export const getArchObjects = (): Promise<any> => {
  return http.get("/api/v1/ArchObject/GetAll");
};

export const updateArchObject = (data: ArchObject): Promise<any> => {
  return http.put(`/api/v1/ArchObject/Update`, data);
};

export const getDistricts = (): Promise<any> => {
  return http.get("/api/v1/MainBackAPI/Districts/GetAll");
};

export const getTundukDistricts = (): Promise<any> => {
  return http.get("/api/v1/MainBackAPI/TundukDistricts");
};

export const getAteChildren = (id: number): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/TundukGetAteChildren?ateId=` + id);
};

export const getAllStreets = (): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/TundukGetAllStreets`);
};

export const getAteStreets = (id: number): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/TundukGetAteStreets?ateId=` + id);
};

export const findAddresses = (streetId: number, building: string, apartment: string, uch: string): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/TundukSearchAddress?streetId=${streetId}&building=${building}&apartment=${apartment}&uch=${uch}`);
};

export const getDarek = (propcode: string): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/TundukSearchAddressesByProp?propcode=${propcode}`);
};

export const getTags = (): Promise<any> => {
  return http.get("/api/v1/MainBackAPI/Tags/GetAll");
};

export const searchStreet = (text: string, ateId: number): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/TundukSearch?text=${encodeURIComponent(text)}&ateId=${ateId}`);
};