import { Dayjs } from "dayjs";

export type uploaded_application_document = {
  
  id: number;
  file_id: number;
  application_document_id: number;
  name: string;
  service_document_id: number;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  document_number: string;
};


export interface ServiceDocumentDTO {
  id: number;                    
  name: string;                  
  name_kg?: string;              
  code?: string;                 
  description?: string;          
  description_kg?: string;       
  law_description?: string;      
  document_type_id: number;      
  doc_is_outcome?: boolean;      
  is_required: boolean;          
  text_color?: string;
  background_color?: string;
}

export interface PaidAmmount {
  total_payed: number;
  total_sum: number;
}
