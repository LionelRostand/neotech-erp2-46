
export interface Invoice {
  id: string;
  invoiceNumber: string;
  number?: string;
  clientName: string;
  clientId?: string;
  clientEmail?: string;
  issueDate: string;
  dueDate: string;
  total: number;
  status: string;
  currency: string;
  items: InvoiceItem[];
  notes?: string;
  paid?: boolean;
  paidDate?: string;
  subtotal?: number;
  tax?: number;
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  discountRate?: number;
  dueAmount?: number;
  termsAndConditions?: string;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber?: string;
  clientName: string;
  clientId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentDate: string;
  status: string;
  reference?: string;
  notes?: string;
  // Additional properties to match actual usage
  date?: string;
  method?: string;
  transactionId?: string;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
}

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
  status: string;
  submittedDate?: string;
  reference?: string;
  notes?: string;
  // Additional properties to match actual usage
  balance?: number;
  totalTaxCollected?: number;
  totalTaxPaid?: number;
  attachments?: any[];
  amount?: number;
  estimatedAmount?: number;
  dateFiled?: string;
  filedBy?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  description?: string;
  isDefault?: boolean;
  active: boolean;
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
  createdAt?: any;
  updatedAt?: any;
}
