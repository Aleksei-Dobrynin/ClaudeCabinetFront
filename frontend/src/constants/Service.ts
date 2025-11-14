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
  description_kg?: string;
  description: string;
  short_name: string;
  code: string;
  day_count: number;
  workflow_id: number;
  workflow_name?: string;
  price: number;
};


export type ServiceCreateModel = {
  id: number;
  name: string;
  short_name: string;
  code: string;
  description: string;
  day_count: number;
  workflow_id: number;
  price: number;
  
};
