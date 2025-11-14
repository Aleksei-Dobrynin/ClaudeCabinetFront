import http from "api/https";
import { UploadedApplicationDocument,UploadedApplicationDocumentCreateModel} from "constants/UploadedApplicationDocument";

export const createUploadedApplicationDocumentWithFile = (data: UploadedApplicationDocument, fileName: string, file: any): Promise<any> => {
  const formData = new FormData();

  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  formData.append("document.fileName", fileName);
  formData.append("document.file", file);


  return http.post(`/api/v1/UploadedApplicationDocument/CreateWithFile`, formData);

  // return http.post(`/api/v1/UploadedApplicationDocument/Create`, data);
};

export const updateUploadedApplicationDocumentWithFile = (data: UploadedApplicationDocument, fileName: string, file: any): Promise<any> => {
  const formData = new FormData();

  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  formData.append("document.fileName", fileName);
  formData.append("document.file", file);


  return http.post(`/api/v1/UploadedApplicationDocument/UpdateWithFile`, formData);

  // return http.post(`/api/v1/UploadedApplicationDocument/Create`, data);
};

export const addUploadedApplicationDocument = (data: UploadedApplicationDocumentCreateModel): Promise<any> => {
  return http.post(`/api/v1/UploadedApplicationDocument/Create`, data);
};

export const addUploadedApplicationDocumentFromOld = (data: UploadedApplicationDocumentCreateModel): Promise<any> => {
  return http.post(`/api/v1/UploadedApplicationDocument/CreateFromOld`, data);
};


export const deleteUploadedApplicationDocument = (id: number): Promise<any> => {
  return http.remove(`/api/v1/UploadedApplicationDocument/Delete?id=${id}`, {});
};

export const getUploadedApplicationDocument = (id: number): Promise<any> => {
  return http.get(`/api/v1/UploadedApplicationDocument/GetOneById?id=${id}`);
};

export const getUploadedApplicationDocuments = (): Promise<any> => {
  return http.get("/api/v1/UploadedApplicationDocument/GetAll");
};

export const updateUploadedApplicationDocument = (data: UploadedApplicationDocument): Promise<any> => {
  return http.put(`/api/v1/UploadedApplicationDocument/Update`, data);
};


export const getUploadedApplicationDocumentsByApplicationId = (applicationId: number): Promise<any> => {
  return http.get(`/api/v1/UploadedApplicationDocument/GetByApplicationId?ApplicationId=${applicationId}`);
};

export const getUploadedApplicationDocumentsForApplication = (applicationId: number): Promise<any> => {
  return http.get(`/api/v1/UploadedApplicationDocument/GetForApplication?ApplicationId=${applicationId}`);
};

export const getUploadedApplicationDocumentsBy = (application_document_id: number): Promise<any> => {
  return http.get(`/uploaded_application_document/GetCustomByApplicationId?application_document_id=${application_document_id}`);
};

export const getAttachedOldDocuments = (idServiceDoc: number): Promise<any> => {
  return http.get(`/api/v1/UploadedApplicationDocument/GetOldUploaded?idServiceDoc=${idServiceDoc}`);
};



