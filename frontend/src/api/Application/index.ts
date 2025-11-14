import http from "api/https";
import { Application, ApplicationCreateModel } from "constants/Application";

export const createApplication = (data: ApplicationCreateModel): Promise<any> => {
  return http.post(`/api/v1/Application/Create`, data);
};

export const deleteApplication = (id: number): Promise<any> => {
  return http.remove(`/api/v1/Application/Delete?id=${id}`, {});
};

export const getApplication = (id: number): Promise<any> => {
  return http.get(`/api/v1/Application/GetOneById?id=${id}`);
};

export const getApplicationByGuid = (guid: string): Promise<any> => {
  return http.get(`/api/v1/Application/GetOneByGuid?guid=${guid}`);
};

export const getApplications = (): Promise<any> => {
  return http.get("/api/v1/Application/GetAll");
};

export const getMyApplications = (statusId: number, search: string, filter: string, curentCompany : number): Promise<any> => {
  return http.get(`/api/v1/Application/GetMyApplicaitons?customerId=${curentCompany}&statusId=${statusId}&search=${search}&filter=${filter}`);
};

export const getMyArchiveApplications = (): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/GetMyArchiveApplications`);
};

export const getApplicationByIdMain = (id: number): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/GetApplicationById?id=${id}`);
};

export const getMainApplicationByGuid = (guid: string): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/applications/${guid}`);
};

export const updateApplication = (data: ApplicationCreateModel): Promise<any> => {
  return http.put(`/api/v1/Application/Update`, data);
};

export const setCustomerToApplication = (
  applicationId: number,
  customerId: number,
): Promise<any> => {
  return http.post(`/api/v1/Application/SetCustomerToApplication`, { applicationId, customerId });
};

export const sendToBga = (applicationId: number, dogovorTemplate: string): Promise<any> => {
  return http.post(`/api/v1/Application/SendToBga`, { applicationId, dogovorTemplate });
};

export const reSendToBga = (applicationId: number): Promise<any> => {
  return http.post(`/api/v1/Application/ReSendToBga`, { applicationId });
};

export const getDogovorTemplate = (applicationId: number, langCode?: string): Promise<any> => {
  let url = `/api/v1/SDocumentTemplate/GetFilledTemplateDogovor?applicationId=${applicationId}`;
  if (langCode) {
    url += `&lang=${langCode}`;
  }
  return http.get(url);
};

export const validateCheckApplication = (applicationId: number): Promise<any> => {
  return http.post(`/api/v1/Application/ValidateCheck`, { applicationId });
};

export const getDocumentByGuid = (guid: string): Promise<any> => {
  return http.get(`/api/v1/Application/GetDocumentByGuid?guid=${guid}`);
};

export const downloadDocumentByGuid = (guid: string): Promise<any> => {
  return http.downloadBlob(`/api/v1/Application/DownloadDocumentByGuid?guid=${guid}`);
};


export const getDashboardApps = (): Promise<any> => {
  return http.get("/api/v1/Application/GetDashboardApps");
};

export const getDashboardStatistic = (): Promise<any> => {
  return http.get("/api/v1/Application/GetDashboardStatistic");
};