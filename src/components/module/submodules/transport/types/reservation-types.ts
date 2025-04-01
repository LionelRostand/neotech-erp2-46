
import { TransportBasic } from './base-types';
import { TransportService } from './base-types';
import { WebBookingService } from './integration-types';

export interface TransportReservation extends Omit<TransportBasic, 'notes'> {
  clientId: string;
  clientName: string;
  vehicleId: string;
  vehicleName: string;
  driverId?: string;
  driverName?: string;
  service: TransportService;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  distance?: number;
  duration?: number;
  passengers: number;
  price: number;
  specialRequirements?: string;
  isPaid: boolean;
  paymentMethod?: string;
  paymentReference?: string;
  needsDriver: boolean;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  contractGenerated: boolean;
  notes: string;
}

export interface Reservation {
  id: string;
  client: string;
  clientName: string;
  vehicle: string;
  driver?: string;
  startDate: string;
  endDate: string;
  pickup: string;
  dropoff: string;
  pickupLocation: Address;
  dropoffLocation: Address;
  totalAmount: number;
  isPaid: boolean;
  paymentStatus: string;
  status: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  address: string;
  city?: string;
  zipCode?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface WebBooking {
  id: string;
  userId: string;
  serviceId: string;
  service: WebBookingService;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  passengers: number;
  specialRequirements?: string;
  price: number;
  isPaid: boolean;
  status: WebBookingStatus;
  createdAt: string;
  updatedAt: string;
}

export type WebBookingStatus = 'new' | 'confirmed' | 'cancelled' | 'processed';

// Helper function to get address string
export const getAddressString = (address?: Address): string => {
  if (!address) return '—';
  return address.address;
};

// Define the reservation status type
export type TransportReservationStatus = 
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no-show';
