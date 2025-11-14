// src/types/documents.ts
export interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  formats: string[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  url: string;
  type: string;
}

export interface DocumentApproval {
  id: string;
  personId: string;
  personName: string;
  role: string;
  approved: boolean;
  date?: string;
  comment?: string;
}
