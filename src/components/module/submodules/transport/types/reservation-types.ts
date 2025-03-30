
import { TransportService } from './base-types';

// Define the service types for web booking that match the TransportService.serviceType
export type WebBookingService = 'airport' | 'hourly' | 'pointToPoint' | 'dayTour';

// Define the structure for a web booking
export interface WebBooking {
  id: string;
  service: WebBookingService | string;
  date: string;
  time: string;
  pickup: string | { address: string };
  dropoff: string | { address: string };
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  passengers: number;
  vehicleType: string;
  needsDriver: boolean;
  status: 'new' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  notes?: string;
}

// Define the structure for a reservation
export interface Reservation {
  id: string;
  clientId: string;
  clientName?: string; // Added for backward compatibility
  vehicleId?: string;
  driverId?: string;
  service?: WebBookingService | string;
  startDate: string;
  endDate: string;
  time?: string;
  pickupLocation?: string | { address: string };
  pickup?: string | { address: string };
  dropoffLocation?: string | { address: string };
  dropoff?: string | { address: string };
  totalAmount?: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus?: 'pending' | 'partial' | 'paid';
  notes?: string;
  passengers?: number;
  createdAt: string;
  updatedAt?: string;
}

// Utility function to get address string from various address formats
export function getAddressString(address: string | { address: string } | undefined): string {
  if (!address) return 'No address';
  if (typeof address === 'string') return address;
  return address.address;
}

// Legacy reservation type for backward compatibility
export interface TransportReservation extends Reservation {}

// Status types for use in components
export type TransportReservationStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
