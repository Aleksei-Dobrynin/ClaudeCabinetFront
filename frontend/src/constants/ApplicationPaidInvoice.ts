import { Dayjs } from "dayjs";

export type ApplicationPaidInvoice = {
  
  id: number;
  applicationId: number;
  customerId: number;
  date: Dayjs;
  paymentIdentifier: string;
  sum: number;
  description: string;
  additional: string;
};


export type ApplicationPaidInvoiceCreateModel = {
  
  id: number;
  applicationId: number;
  customerId: number;
  date: Dayjs;
  paymentIdentifier: string;
  sum: number;
  description: string;
  additional: string;
};
