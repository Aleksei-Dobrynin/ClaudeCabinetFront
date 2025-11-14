
import { Customer } from "constants/Customer";

export interface ArchObject {
  id: number;
  districtId: number;
  applicationId: number;
  address: string;
  address_street: string | null;
  address_building: string | null;
  address_flat: string | null;
  name: string;
  identifier: string;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  description: string;
  xCoord: number | null;
  yCoord: number | null;
  tags: number[];
}

// export interface Customer {
//   id: number;
//   pin: string;
//   okpo: string | null;
//   isPhysical: boolean;
//   postalCode: string;
//   ugns: string | null;
//   regNumber: string | null;
//   organizationTypeId: number | null;
//   createdAt: string;
//   updatedAt: string;
//   createdBy: number;
//   updatedBy: number;
//   name: string;
//   address: string;
//   director: string;
//   nomer: string | null;
//   phone1: string | null;
//   phone2: string | null;
//   email: string | null;
//   email_2: string | null;
//   identity_document_type_code: string | null;
//   isForeign: boolean;
//   foreignCountry: number;
//   allowNotification: boolean | null;
//   payment_account: string | null;
//   bank: string | null;
//   bik: string | null;
//   passport_series: string | null;
//   passport_issued_date: string | null;
//   passport_whom_issued: string | null;
// }

export interface Document {
  id: number;
  app_doc_id?: number;
  doc_name: string;
  type: string;
  status: 'approved' | 'rejected' | 'pending' | 'uploaded' | 'not_uploaded';
  comment?: string;
  url?: string;
  created_at: string;
  file_id?: number;
  file_name?: string;
  is_outcome?: boolean;
  is_required?: boolean;
  is_signed?: boolean;
  application_document_id?: number;
}

export interface UploadDocument {
  id: number;
  applicationId: number;
  documentTypeId: number;
  fileId: number;
  createdAt: string;
  createdBy: number;
}

export interface WorkDocument {
  id: number;
  applicationId: number;
  name: string;
  description: string;
  fileId: number;
  createdAt: string;
  createdBy: number;
}

export interface Application {
  id: number;
  work_description: string;
  arch_object_id: number | null;
  status_id: number;
  status_name: string;
  status_text_color: string;
  status_back_color: string;
  status_code: string;
  company_id: number;
  r_service_id: number;
  r_service_name: string;
  unique_code: string;
  registration_date: string | null;
  last_updated_status: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  deadline: string | null;
  number: string;
  comment: string;
  arch_objects: ArchObject[];
  upload_documents: UploadDocument[] | null;
  work_documents: WorkDocument[] | null;
  main_application: number | null;
  address: string | null;
  reject_html: string | null;
  reject_file_id: number | null;
  app_cabinet_uuid: string;
  total_sum: number;
  customer: Customer;
  completion_act?: any;
  final_documents?: any;
  contract?: any;
  total_paid: number;
}
export interface ApplicationMain {
  id: number;
  registration_date: string;
  service_name: string;
  service_id: number;
  deadline: string;
  status_code: string;
  number: number;
  current_step: any;
}

export interface District {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
}

export interface Correction {
  id: string;
  field: string;
  message: string;
  status: 'pending' | 'fixed';
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  status: 'pending' | 'paid' | 'checking' | 'confirmed';
  url?: string;
  paymentProof?: string;
  paymentDate?: string;
  confirmationDate?: string;
  bankDetails?: {
    bank: string;
    account: string;
    bik: string;
  };
}

export interface Contract {
  id: string;
  number: string;
  url: string;
  signed: boolean;
  signedDate?: string;
  createdDate: string;
}

export interface CompletionAct {
  id: string;
  url: string;
  signed: boolean;
  signedDate?: string;
}

export interface FinalDocument {
  id: string;
  name: string;
  url: string;
  issueDate: string;
  type: 'building_permit' | 'architectural_conclusion' | 'urban_plan' | 'technical_conditions' | 'compliance_conclusion' | 'other';
  status: 'draft' | 'issued';
  description?: string;
  validUntil?: string;
}

export interface Participant {
  id: string;
  role: string;
  name: string;
  inn: string;
  phone: string;
  email: string;
}