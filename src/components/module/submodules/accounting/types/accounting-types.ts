export interface Invoice {
  id: string;
  number: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending';
  notes: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  amount: number;
}

export interface Payment {
  id: string;
  amount: number;
  invoiceId: string;
  invoiceNumber?: string;
  clientId?: string;
  clientName?: string;
  date: string;
  method: 'card' | 'cash' | 'transfer' | 'check' | 'other';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionId: string;
  currency: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  description: string;
  isDefault: boolean;
}

export interface TaxDeclaration {
  id: string;
  period: string;
  dateFiled?: string;
  dueDate?: string;
  amount: number;
  estimatedAmount?: number;
  status: 'filed' | 'upcoming';
  filedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
