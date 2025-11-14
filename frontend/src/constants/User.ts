import dayjs, { Dayjs } from "dayjs";

export type User = {
  id: number;
  isApproved: boolean;
  lastName: string;
  firstName: string;
  secondName: string;
  companyId: number;
  isDirector: boolean;
  pin: string;
  is_physical?: boolean;
  is_seen_tour?: boolean;
};

export type UserCreateModel = {
  id: number;
  isApproved: boolean;
  lastName: string;
  firstName: string;
  secondName: string;
  companyId: number;
  isDirector: boolean;
  pin: string;
};

export type Organization = {
  id: number;
  name: string;
  pin: string;
  email: string | null;
  isPhysical: boolean | false;
  passport_series: string | null;
  passport_issued_date: Dayjs | null;
  passport_whom_issued: string | null;
}
