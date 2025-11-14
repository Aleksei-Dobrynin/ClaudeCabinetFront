import { Dayjs } from "dayjs";

export type UserLoginHistory = {
  
  startTime: Dayjs;
  endTime: Dayjs;
  authTypeId: number;
  userId: number;
  id: number;
  ipAddress: string;
  device: string;
  browser: string;
  os: string;
};


export type UserLoginHistoryCreateModel = {
  
  startTime: Dayjs;
  endTime: Dayjs;
  authTypeId: number;
  userId: number;
  id: number;
  ipAddress: string;
  device: string;
  browser: string;
  os: string;
};
