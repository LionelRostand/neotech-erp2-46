
// Salon billing types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending';
export type PaymentMethod = 'credit_card' | 'cash' | 'mobile_payment' | 'gift_card' | 'transfer';

export interface SalonInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface SalonPayment {
  id: string;
  date: string;
  method: PaymentMethod;
  amount: number;
  reference?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  notes?: string;
  createdAt: string;
  invoiceId?: string; // Added this field to fix the paymentService error
}

export interface SalonInvoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  items: SalonInvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  payments: SalonPayment[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSummary {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
  todaySales: number;
  pendingInvoices: number;
  overdueInvoices: number;
}

// Salon client types
export interface SalonVisit {
  date: string;
  service: string;
  stylist: string;
  price: number;
  satisfaction?: string;
  notes?: string;
}

export interface SalonClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  address?: string;
  preferences?: string;
  notes?: string;
  preferredStylist?: string;
  loyaltyPoints: number;
  createdAt: string;
  lastVisit: string | null;
  visits: SalonVisit[];
  appointments: SalonAppointment[];
}

// Salon appointment types
export interface SalonAppointment {
  id: string;
  clientId: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

// Salon product types
export interface SalonProduct {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  stockQuantity: number;
  minStock: number;
  category: string;
  imageUrl: string;
  relatedServices?: string[];
  soldToday: number;
  soldTotal: number;
}

// Salon service types
export interface SalonService {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  available: boolean;
  popularityScore: number;
  specialists?: string[]; // Add specialists property that is used in the components
}

// Salon stylist types
export interface SalonStylist {
  id: string;
  firstName: string; // Changed from 'name' to 'firstName' to match usage in components
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  schedule: any[]; // This field was referenced but not defined in the previous type
  position?: string;
  availability?: string[];
  bio?: string;
  image?: string;
  rating?: number;
}
