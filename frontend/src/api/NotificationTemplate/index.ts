import http from "api/https";
import { NotificationTemplate } from "constants/NotificationTemplate";

export const createNotificationTemplate = (data: NotificationTemplate): Promise<any> => {
  return http.post(`/api/v1/NotificationTemplate/Create`, data);
};

export const deleteNotificationTemplate = (id: number): Promise<any> => {
  return http.remove(`/api/v1/NotificationTemplate/Delete?id=${id}`, {});
};

export const getNotificationTemplate = (id: number): Promise<any> => {
  return http.get(`/api/v1/NotificationTemplate/GetOneById?id=${id}`);
};

export const getNotificationTemplates = (): Promise<any> => {
  return http.get("/api/v1/NotificationTemplate/GetAll");
};

export const updateNotificationTemplate = (data: NotificationTemplate): Promise<any> => {
  return http.put(`/api/v1/NotificationTemplate/Update`, data);
};


