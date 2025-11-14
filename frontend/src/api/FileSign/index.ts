import http from "api/https";

export const signFiles = (ids: number[], applicationId: number, pin: string, code: string): Promise<any> => {
  return http.post(`/api/v1/appFile/SignDocuments`, { ids, applicationId, pin, code },);
};

export const sendCode = (pin: string): Promise<any> => {
  return http.get(`/api/v1/appFile/SendCode?pin=${pin}`, {}, );
};