import { Dayjs } from "dayjs";

export type UserAuthMethods = {
  
  id: number;
  authTypeId: number;
  userId: number;
  authData: string;
};


export type UserAuthMethodsCreateModel = {
  
  id: number;
  authTypeId: number;
  userId: number;
  authData: string;
};
