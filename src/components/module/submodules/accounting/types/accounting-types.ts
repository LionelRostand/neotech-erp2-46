
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
  status: 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  currency: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  discountRate: number;
  notes?: string;
  termsAndConditions?: string;
  containerReference?: string;
  containerCost?: number;
  shipmentReference?: string;
  shipmentStatus?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate?: number;
}

export interface Payment {
  id: string;
  invoiceNumber: string;
  invoiceId?: string;
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

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaxDeclaration {
  id: string;
  reference: string;
  period: {
    start: string;
    end: string;
  };
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  taxAuthority: string;
  taxType: string;
  totalAmount: number;
  submissionDate?: string;
  dueDate: string;
  notes?: string;
  documents?: {
    id: string;
    name: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AccountingSettings {
  id: string;
  defaultCurrency: string;
  defaultTaxRate: number;
  paymentTerms: number;
  defaultNotes?: string;
  defaultTermsAndConditions?: string;
  emailSettings: {
    sendInvoiceEmails: boolean;
    sendPaymentReminders: boolean;
    reminderDays: number[];
  };
  invoiceNumberFormat: string;
  invoiceNumberPrefix: string;
  invoiceNumberSuffix: string;
  invoiceNumberDigits: number;
  nextInvoiceNumber: number;
}
