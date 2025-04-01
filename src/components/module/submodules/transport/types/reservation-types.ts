
import { TransportBasic } from './base-types';
import { TransportService } from './base-types';

export interface TransportReservation extends Omit<TransportBasic, 'notes'> {
  clientId: string;
  vehicleId: string;
  driverId?: string;
  date: string;
  time: string;
  status: TransportReservationStatus;
  pickup: string | { address: string };
  dropoff: string | { address: string };
  needsDriver: boolean;
  service?: TransportService | { name: string };
  specialRequirements?: string;
  createdBy?: string;
  totalPrice?: number;
  notes?: string | any[]; // Modified to accept both string and array
  price?: number; // Added price field
  isPaid?: boolean; // Added isPaid field
  contractGenerated?: boolean; // Added contractGenerated field
}

export interface Reservation {
  id: string;
  client: string;
  clientName: string;
  vehicle: string;
  driver: string;
  startDate: string;
  endDate: string;
  pickupLocation: Address;
  dropoffLocation: Address;
  status: string;
  price?: number;
  serviceType: string;
  paymentStatus?: PaymentStatus;
  isPaid?: boolean;
  notes: any[];
  createdAt?: string;
  updatedAt?: string;
  pickup: string;
  dropoff: string;
  totalAmount: number;
}

export interface Address {
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export type TransportReservationStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'no-show' | 'cancelled';
export type PaymentStatus = 'paid' | 'unpaid' | 'partial' | 'refunded';

export interface ReservationFilter {
  status?: TransportReservationStatus[];
  startDate?: Date;
  endDate?: Date;
  client?: string;
  vehicle?: string;
  driver?: string;
  search?: string;
}

// Helper function to get a formatted address string from an Address object
export const getAddressString = (location?: Address | string): string => {
  if (!location) return '';
  if (typeof location === 'string') return location;
  return location.address || '';
};

// Export WebBookingStatus which was declared but not exported
export type WebBookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'canceled' 
  | 'completed' 
  | 'new' 
  | 'cancelled' 
  | 'processed';
