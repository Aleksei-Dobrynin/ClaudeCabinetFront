import http from "api/https";

// Types for registration data (simplified version without files)
export interface CompanyRegistrationData {
  inn: string;
  companyName: string;
  email: string;
}

// Response format from Tunduk API (as expected)
export interface TundukCompanyInfo {
  companyName: string;
  legalAddress: string;
  registrationDate: string;
  registrationNumber: string;
  // Additional fields that might come from Tunduk
}

/**
 * Check if an INN already exists in the system
 * @param inn The INN to check
 * @returns Promise containing whether the INN exists or not
 */
export const checkInnExists = (inn: string): Promise<any> => {
  return http.get(`/api/v1/Customer/CheckInnExists?inn=${inn}`);
};

/**
 * Get company information from Tunduk by INN
 * @param inn The INN to search for
 * @returns Promise containing company information if found
 */
export const getTundukCompanyInfo = (inn: string): Promise<any> => {
  return http.get(`/api/v1/Customer/GetTundukInfo?inn=${inn}`);
};

export const getPersonalDataAgreementText = (): Promise<any> => {
  return http.get(`/api/v1/Customer/GetPersonalDataAgreementText`);
};

export const getApplicationDataAgreementText = (): Promise<any> => {
  return http.get(`/api/v1/Customer/GetApplicationDataAgreementText`);
};

/**
 * Register a new company with confirmation files
 * @param formData FormData containing company info and files
 * @returns Promise containing the registration result
 */
export const registerCompany = (formData: FormData): Promise<any> => {
  return http.post(`/api/v1/Customer/Register`, formData, {
    "Content-Type": "multipart/form-data"
  });
};

/**
 * Sign documents with EDS
 * @param fileIds Array of file IDs to sign
 * @returns Promise containing the signing result
 */
export const signDocuments = (fileIds: number[]): Promise<any> => {
  return http.post(`/api/v1/FileSign/SignFiles`, { fileIds });
};