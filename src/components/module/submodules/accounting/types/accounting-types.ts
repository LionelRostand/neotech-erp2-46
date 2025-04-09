
export interface Invoice {
  id: string;
  invoiceNumber?: string;
  number?: string;
  clientName?: string;
  clientId?: string;
  issueDate?: string;
  dueDate?: string;
  total?: number;
  status: string;
  currency?: string;
  items?: InvoiceItem[];
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  notes?: string;
  termsAndConditions?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  // Don't include 'id' here as it's not needed in the type definition
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'card' | 'cash' | 'other';
  isDefault: boolean;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  date: string;
  method: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  reference?: string;
  transactionId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  description?: string;
  isDefault: boolean;
}

export interface AccountingSettings {
  companyName: string;
  address: string;
  vatNumber?: string;
  defaultCurrency: string;
  defaultPaymentTerms: number;
  defaultNotes?: string;
  defaultTerms?: string;
  invoiceNumberPrefix: string;
  nextInvoiceNumber: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  account: string;
  isReconciled: boolean;
  reference?: string;
  notes?: string;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaxDeclaration {
  id: string;
  period: string;
  dateFiled?: string;
  dueDate: string;
  amount: number;
  estimatedAmount?: number;
  status: 'upcoming' | 'filed' | 'paid' | 'late';
  filedBy?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
