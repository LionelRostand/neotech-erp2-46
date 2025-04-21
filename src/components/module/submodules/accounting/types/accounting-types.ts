export interface Invoice {
  id: string;
  invoiceNumber: string;
  number?: string;
  clientName: string;
  clientId: string;
  clientEmail?: string;
  issueDate: string;
  dueDate: string;
  total: number;
  status: 'pending' | 'draft' | 'paid' | 'overdue' | 'cancelled';
  currency?: string;
  items: InvoiceItem[];
  subtotal?: number;
  tax?: number;
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  discountRate?: number;
  notes?: string;
  termsAndConditions?: string;
  containerReference?: string;  // Added for container tracking
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  date: string;
  paymentMethod: string;
  notes?: string;
  status: 'pending' | 'completed' | 'failed';
  currency?: string;
}
