
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
  discountAmount?: number;
  discountRate?: number;
  dueAmount?: number;
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
  createdAt?: any;
  updatedAt?: any;
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
