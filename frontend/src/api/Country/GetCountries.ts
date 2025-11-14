import http from "../https";

export const getCountries = (): Promise<any> => {
  return http.get("/api/v1/MainBackAPI/Country/GetAll");
};