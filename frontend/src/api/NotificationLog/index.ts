import http from "api/https";
import { NotificationLog } from "constants/NotificationLog";

export const createNotificationLog = (data: NotificationLog): Promise<any> => {
  return http.post(`/api/v1/NotificationLog/Create`, data);
};

export const deleteNotificationLog = (id: number): Promise<any> => {
  return http.remove(`/api/v1/NotificationLog/Delete?id=${id}`, {});
};

export const getNotificationLog = (id: number): Promise<any> => {
  return http.get(`/api/v1/NotificationLog/GetOneById?id=${id}`);
};

export const getNotificationLogs = (): Promise<any> => {
  return http.get("/api/v1/NotificationLog/GetAll");
};

export const updateNotificationLog = (data: NotificationLog): Promise<any> => {
  return http.put(`/api/v1/NotificationLog/Update`, data);
};

export const getMyNotificationLogs = (): Promise<any> => {
  return http.get("/api/v1/Notification/GetMyNotification");
};

export const clearNotifications = (): Promise<any> => {
  return http.post(`/api/v1/Notification/ClearAllNotifications`, {});
};
export const clearNotification = (id: number): Promise<any> => {
  return http.post(`/api/v1/Notification/ClearNotification`, { id: id });
};

export const getCommonSettings = (): Promise<any> => {
  return http.get("/api/v1/CommonSetting/GetAll");
};
