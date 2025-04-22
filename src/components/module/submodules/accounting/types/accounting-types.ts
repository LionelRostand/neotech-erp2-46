
export interface Payment {
  id: string;
  date: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  currency: string;
  shipmentReference?: string;
  containerNumber?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  number: string;
  clientName: string;
  clientId: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  total: number;
  status: string;
  currency: string;
  items: any[];
  subtotal: number;
  tax: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  discountRate: number;
  notes: string;
  termsAndConditions: string;
  shipmentReference: string;
  containerReference: string;
  containerCost: number;
  shipmentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
