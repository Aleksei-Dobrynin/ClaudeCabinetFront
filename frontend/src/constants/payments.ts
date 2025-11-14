
// src/types/payments.ts
export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  method: string;
  reference: string;
}