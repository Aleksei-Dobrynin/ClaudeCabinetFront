import http from "api/https";
import { UserAuthMethods } from "constants/UserAuthMethods";

export const createUserAuthMethods = (data: UserAuthMethods): Promise<any> => {
  return http.post(`/api/v1/UserAuthMethods/Create`, data);
};

export const deleteUserAuthMethods = (id: number): Promise<any> => {
  return http.remove(`/api/v1/UserAuthMethods/Delete?id=${id}`, {});
};

export const getUserAuthMethods = (id: number): Promise<any> => {
  return http.get(`/api/v1/UserAuthMethods/GetOneById?id=${id}`);
};

export const getUserAuthMethod = (): Promise<any> => {
  return http.get("/api/v1/UserAuthMethods/GetAll");
};

export const updateUserAuthMethods = (data: UserAuthMethods): Promise<any> => {
  return http.put(`/api/v1/UserAuthMethods/Update`, data);
};


export const getUserAuthMethodByUserId = (userId: number): Promise<any> => {
  return http.get(`/api/v1/UserAuthMethods/GetByUserId?UserId=${userId}`);
};
