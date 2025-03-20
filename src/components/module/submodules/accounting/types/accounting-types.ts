
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'stripe' | 'paypal' | 'bank_transfer' | 'cash' | 'check' | 'other';
export type TaxType = 'standard' | 'reduced' | 'exempt';
export type ReportType = 'balance_sheet' | 'income_statement' | 'ledger' | 'cash_flow';
export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'CAD' | 'CHF' | 'JPY';

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  currency: CurrencyCode;
  notes?: string;
  termsAndConditions?: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxType: TaxType;
  total: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  currency: CurrencyCode;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  iban?: string;
  bic?: string;
  bank: string;
  currency: CurrencyCode;
  balance: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  accountId: string;
  invoiceId?: string;
  paymentId?: string;
  isReconciled: boolean;
  currency: CurrencyCode;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaxSettings {
  id: string;
  country: string;
  standardRate: number;
  reducedRates: { name: string; rate: number }[];
  declarationPeriod: 'monthly' | 'quarterly' | 'yearly';
  createdAt: string;
  updatedAt: string;
}

export interface AccountingSettings {
  id: string;
  defaultCurrency: CurrencyCode;
  invoicePrefix: string;
  invoiceNumberFormat: string;
  nextInvoiceNumber: number;
  fiscalYearStart: string;
  invoicePaymentTerms: number;
  automaticReminders: boolean;
  reminderDays: number[];
  taxId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  bankBalance: number;
  openInvoices: number;
  overdueInvoices: number;
  recentTransactions: Transaction[];
  monthlyRevenue: { month: string; amount: number }[];
  monthlyExpenses: { month: string; amount: number }[];
  topClients: { id: string; name: string; revenue: number }[];
}
