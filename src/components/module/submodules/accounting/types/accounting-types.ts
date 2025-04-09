
export interface Invoice {
  id: string;
  invoiceNumber?: string;
  number?: string;
  clientName?: string;
  issueDate?: string;
  dueDate?: string;
  total?: number;
  status: string;
  currency?: string;
  items?: InvoiceItem[];
  subtotal?: number;
  taxAmount?: number;
  notes?: string;
  termsAndConditions?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
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
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
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
