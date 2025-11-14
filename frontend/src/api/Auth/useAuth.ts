import http from "api/https";

export type Auth = {
  Pin: string;
  TokenId: string;
  Signature: string;
  DeviceId?: string;
};

export type CredentialsAuth = {
  Email: string;
  Password: string;
  DeviceId?: string;
};

export const auth = (data: Auth): Promise<any> => {
  return http.post(`/api/v1/Auth/login`, data);
};

export const authWithCredentials = (data: CredentialsAuth): Promise<any> => {
  return http.post(`/api/v1/Auth/login-credentials`, data);
};

export const register = (
  data: CredentialsAuth & { FirstName?: string; LastName?: string; SecondName?: string }
): Promise<any> => {
  return http.post(`/api/v1/Auth/register`, data);
};

export const logout = (): Promise<any> => {
  return http.post(`/api/v1/Auth/logout`, {}, {}, { withCredentials: true });
};

export const refreshToken = (): Promise<any> => {
  return http.post(`/api/v1/Auth/refresh-token`, {}, {}, { withCredentials: true });
};

export const checkAuthStatus = (): Promise<any> => {
  return http.get(`/api/v1/Auth/validate`, {}, { withCredentials: true });
};

export const requestPasswordReset = (email: string): Promise<any> => {
  return http.post(`/api/v1/Auth/request-password-reset`, { email });
};

export const resetPassword = (token: string, newPassword: string): Promise<any> => {
  return http.post(`/api/v1/Auth/reset-password`, { token, newPassword });
};

export const registerRepresentative = (
  email: string,
  companyId: number,
  pin: string,
  firstName: string,
  lastName: string,
  secondName: string
): Promise<any> => {
  const data = {
    Email: email,
    companyId: companyId,
    pin: pin,
    firstName: firstName,
    lastName: lastName,
    secondName: secondName,
  }
  return http.post(`/api/v1/Auth/register-representative`, data);
};

export const login2f = (data: Auth, code): Promise<any> => {
  var data2f = {
    Pin: data.Pin,
    TokenId: data.TokenId,
    Signature: data.Signature,
    DeviceId: data.DeviceId,
    Code: code,
  };
  return http.post(`/Auth/verify-2fa`, data2f);
};