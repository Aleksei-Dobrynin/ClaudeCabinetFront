import { Dayjs } from "dayjs";

export type SDocumenttemplate = {
  
  id: number;
  nameKg: string;
  descriptionKg: string;
  textColor: string;
  backgroundColor: string;
  name: string;
  description: string;
  code: string;
  idcustomsvgicon: number;
  iconcolor: string;
  iddocumenttype: number;
};


export type SDocumenttemplateCreateModel = {
  
  id: number;
  nameKg: string;
  descriptionKg: string;
  textColor: string;
  backgroundColor: string;
  name: string;
  description: string;
  code: string;
  idcustomsvgicon: number;
  iconcolor: string;
  iddocumenttype: number;
};
