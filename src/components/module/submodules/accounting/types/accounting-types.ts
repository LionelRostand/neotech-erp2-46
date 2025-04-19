
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
  invoiceId?: string; // Add this field
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  description?: string;
  isDefault: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Add missing Invoice interface
export interface Invoice {
  id: string;
  invoiceNumber: string;
  number: string;
  clientName: string;
  clientId: string;
  clientEmail?: string;
  issueDate: string;
  dueDate: string;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending';
  currency: string;
  items: any[];
  subtotal: number;
  tax?: number;
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  discountRate?: number;
  notes?: string;
  termsAndConditions?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// Add missing Transaction interface
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

// Add missing TaxDeclaration interface
export interface TaxDeclaration {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  dueDate: string;
  totalRevenue: number;
  totalVatCollected: number;
  totalVatPaid: number;
  netVat: number;
  status: 'draft' | 'pending' | 'filed' | 'paid' | 'late';
  reference?: string;
  notes?: string;
  totalTaxCollected: number;
  totalTaxPaid: number;
  balance: number;
  attachments: string[];
  amount?: number;
  estimatedAmount?: number;
  dateFiled?: string;
  filedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
