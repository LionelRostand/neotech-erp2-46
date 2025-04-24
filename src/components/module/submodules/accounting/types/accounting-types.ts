
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientAddress?: string;
  issueDate: string | Date;
  dueDate: string | Date;
  items: InvoiceItem[];
  taxRate: number;
  taxAmount: number;
  subtotal: number;
  total: number;
  notes?: string;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
  createdBy?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'overdue' | 'paid' | 'cancelled' | 'partial';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'overdue' | 'refunded';

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  date: string | Date;
  amount: number;
  currency: string;
  method: string;
  status: PaymentStatus;
  notes?: string;
  transactionId?: string;
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
}

export interface Transaction {
  id: string;
  date: string | Date;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  account: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit' | 'savings' | 'other';
  currency: string;
  balance: number;
  isActive: boolean;
  notes?: string;
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
}

export interface TaxDeclaration {
  id: string;
  name: string;
  period: {
    startDate: string | Date;
    endDate: string | Date;
  };
  totalSales: number;
  totalTax: number;
  status: 'draft' | 'ready' | 'submitted' | 'accepted' | 'rejected';
  submissionDate?: string | Date;
  notes?: string;
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
}
