export interface Payment {
  id: string;
  invoiceNumber: string;
  clientName: string;
  date: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  method: string;
  transactionId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
