// src/constants/ApplicationApi.ts

export type Service = {
  id: number;
  name: string;
  name_kg?: string;
  name_long?: string;
  name_long_kg?: string;
  name_statement?: string;
  name_statement_kg?: string;
  name_confirmation?: string;
  name_confirmation_kg?: string;
  short_name: string;
  code: string;
  description: string;
  day_count: number;
  workflow_id: number;
  workflow_name?: string;
  price: number;
};

export interface ObjectTag {
  id: number;
  name: string;
  code: string;
}

export interface ApplicationData {
  id: number;
  serviceId: number | null;
  workType: string;
  objects: any[];
  applicant: ParticipantData | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParticipantData {
  inn: string;
  name: string;
  type: 'individual' | 'legal';
  phone: string;
  email: string;
  address: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
}