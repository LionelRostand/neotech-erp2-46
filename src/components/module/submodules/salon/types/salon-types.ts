
// Salon Client Types
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

// Visit History
export interface SalonVisit {
  date: string;
  service: string;
  stylist: string;
  price: number;
  satisfaction?: 'Très satisfait' | 'Satisfait' | 'Insatisfait';
  notes?: string;
}

// Appointment
export interface SalonAppointment {
  id: string;
  clientId: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

// Stylist
export interface SalonStylist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  schedule: SalonSchedule[];
  avatar?: string;
}

// Schedule
export interface SalonSchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  isWorking: boolean;
}

// Service
export interface SalonService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  specialists?: string[];
}

// Products
export interface SalonProduct {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  stockQuantity: number;
  minStock: number;
  category: string;
  imageUrl?: string;
  relatedServices?: string[];
  soldToday: number;
  soldTotal: number;
}

// Product Category
export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
}

// Billing Types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending';
export type PaymentMethod = 'cash' | 'credit_card' | 'mobile_payment' | 'gift_card' | 'transfer';

export interface SalonInvoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  payments: SalonPayment[];
}

export interface InvoiceItem {
  id: string;
  type: 'service' | 'product';
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  serviceId?: string;
  productId?: string;
  stylistId?: string;
  stylistName?: string;
}

export interface SalonPayment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  reference?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  notes?: string;
  createdAt: string;
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
