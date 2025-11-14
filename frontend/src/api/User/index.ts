import http from "api/https";
import { User } from "constants/User";

export const createUser = (data: User): Promise<any> => {
  return http.post(`/api/v1/User/Create`, data);
};

export const deleteUser = (id: number): Promise<any> => {
  return http.remove(`/api/v1/User/Delete?id=${id}`, {});
};

export const getUser = (id: number): Promise<any> => {
  return http.get(`/api/v1/User/GetOneById?id=${id}`);
};

export const getMyInfo = (): Promise<any> => {
  return http.get(`/api/v1/User/GetMyInfo`);
};

export const setSeenTour = (): Promise<any> => {
  return http.get(`/api/v1/User/SeenTour`);
};

export const getUsers = (): Promise<any> => {
  return http.get("/api/v1/User/GetAll");
};

export const updateUser = (data: User): Promise<any> => {
  return http.put(`/api/v1/User/Update`, data);
};


export const updateUserInfo = (data: {
  id: number;
  firstName: string;
  lastName: string;
  secondName: string;
}): Promise<any> => {
  return http.put(`/api/v1/User/UpdateUserInfo`, data);
};

export const changePassword = (data: {
  id: number;
  oldPassword: string;
  newPassword: string;
}): Promise<any> => {
  return http.post(`/api/v1/User/ChangePassword`, data);
};

export const forgotPassword = (data: {
  Email: string;
  DeviceId: string;
}): Promise<any> => {
  return http.post(`/api/v1/User/ForgotPassword`, data);
};