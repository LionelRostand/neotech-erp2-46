
// Salon billing types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'credit_card' | 'cash' | 'mobile_payment' | 'gift_card' | 'transfer';

export interface SalonInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface SalonPayment {
  id: string;
  date: string;
  method: PaymentMethod;
  amount: number;
  reference?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  notes?: string;
  createdAt: string;
}

export interface SalonInvoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  items: SalonInvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  payments: SalonPayment[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSummary {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
  todaySales: number;
  pendingInvoices: number;
  overdueInvoices: number;
}
