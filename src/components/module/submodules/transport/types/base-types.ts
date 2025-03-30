
// Base types for the transport module

export type TransportService = 
  | 'taxi'
  | 'shuttle'
  | 'vip'
  | 'airport'
  | 'event'
  | 'corporate'
  | 'tour'
  | 'other';

export type TransportVehicleType = 
  | 'sedan'
  | 'suv'
  | 'van'
  | 'minibus'
  | 'bus'
  | 'luxury'
  | 'electric'
  | 'other';

export interface TransportDriver {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'active' | 'inactive' | 'vacation' | 'sick';
  rating?: number;
  specializations?: string[];
  hireDate?: string;
  birthDate?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  documents?: {
    licenseImageUrl?: string;
    insuranceImageUrl?: string;
    contractUrl?: string;
  };
}

export interface TransportVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color?: string;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  type: TransportVehicleType;
  capacity: number;
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'other';
  mileage?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  features?: string[];
  location?: {
    latitude: number;
    longitude: number;
    lastUpdated: string;
  };
  images?: string[];
}

export type PaymentMethod = 'card' | 'cash' | 'transfer' | 'check' | 'paypal' | 'other';
export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'cancelled' | 'overdue';

export interface TransportClient {
  id: string;
  type: 'individual' | 'company';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email: string;
  phone?: string;
  address?: string;
  loyaltyPoints?: number;
  preferredPaymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
  lastBookingDate?: string;
  totalBookings?: number;
}

export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  transactionId?: string;
  notes?: string;
  receiptUrl?: string;
}
