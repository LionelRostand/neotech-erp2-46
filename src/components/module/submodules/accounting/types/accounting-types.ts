
// Types pour le module de comptabilité

// Type pour les factures
export interface Invoice {
  id: string;
  invoiceNumber: string;
  number?: string; // Alias pour invoiceNumber (compatibilité)
  clientName: string;
  clientId?: string;
  issueDate: string;
  dueDate: string;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending' | string;
  currency: 'EUR' | 'USD' | 'GBP' | 'CAD' | string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount: number;
  notes?: string;
  termsAndConditions?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// Type pour les lignes de facture
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
}

// Type pour les paiements
export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: 'EUR' | 'USD' | 'GBP' | 'CAD' | 'JPY' | string;
  date: string;
  method: 'bank_transfer' | 'cash' | 'check' | 'stripe' | 'paypal' | string;
  status: 'completed' | 'pending' | 'failed' | 'refunded' | string;
  reference?: string;
  transactionId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// Type pour les transactions
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | string;
  category: string;
  account: string;
  isReconciled: boolean;
  reference?: string;
  notes?: string;
  currency: 'EUR' | 'USD' | 'GBP' | 'CAD' | string;
  createdAt?: string;
  updatedAt?: string;
}

// Type pour les taux de taxe
export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  description?: string;
  isDefault?: boolean;
}

// Type pour les déclarations de TVA
export interface TaxDeclaration {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  dueDate: string;
  totalTaxCollected: number;
  totalTaxPaid: number;
  balance: number;
  status: 'draft' | 'submitted' | 'paid' | 'overdue' | string;
  reference?: string;
  notes?: string;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Type pour les paramètres de comptabilité
export interface AccountingSettings {
  id: string;
  companyName: string;
  companyAddress: string;
  companyVatNumber?: string;
  defaultCurrency: 'EUR' | 'USD' | 'GBP' | 'CAD' | string;
  defaultTaxRate: number;
  invoicePrefix?: string;
  invoiceStartNumber?: number;
  paymentTerms?: string;
  bankAccount?: {
    name: string;
    iban: string;
    bic: string;
  };
  updatedAt?: string;
}

// Type pour les permissions de comptabilité
export interface AccountingPermission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  canViewInvoices: boolean;
  canCreateInvoices: boolean;
  canEditInvoices: boolean;
  canDeleteInvoices: boolean;
  canViewPayments: boolean;
  canCreatePayments: boolean;
  canEditPayments: boolean;
  canDeletePayments: boolean;
  canViewReports: boolean;
  canViewSettings: boolean;
  canEditSettings: boolean;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}
