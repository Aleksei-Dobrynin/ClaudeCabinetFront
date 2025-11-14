import http from "api/https";
import { UserLoginHistory } from "constants/UserLoginHistory";

export const createUserLoginHistory = (data: UserLoginHistory): Promise<any> => {
  return http.post(`/api/v1/UserLoginHistory/Create`, data);
};

export const deleteUserLoginHistory = (id: number): Promise<any> => {
  return http.remove(`/api/v1/UserLoginHistory/Delete?id=${id}`, {});
};

export const getUserLoginHistory = (id: number): Promise<any> => {
  return http.get(`/api/v1/UserLoginHistory/GetOneById?id=${id}`);
};

export const getUserLoginHistories = (): Promise<any> => {
  return http.get("/api/v1/UserLoginHistory/GetAll");
};

export const updateUserLoginHistory = (data: UserLoginHistory): Promise<any> => {
  return http.put(`/api/v1/UserLoginHistory/Update`, data);
};


export const getUserLoginHistoriesByUserId = (userId: number): Promise<any> => {
  return http.get(`/api/v1/UserLoginHistory/GetByUserId?UserId=${userId}`);
};
