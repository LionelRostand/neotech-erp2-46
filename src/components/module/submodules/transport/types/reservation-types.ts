
import { TransportService } from './base-types';

export interface WebBooking {
  id: string;
  service: TransportService;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  passengers: number;
  vehicleType: string;
  needsDriver: boolean;
  status: 'new' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Reservation {
  id: string;
  clientId: string;
  clientName: string;
  date?: string;
  time?: string;
  pickup?: string | {address: string};
  dropoff?: string | {address: string};
  service?: TransportService;
  passengers?: number;
  vehicleId?: string;
  driverId?: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  price?: number;
  paymentStatus?: 'pending' | 'paid' | 'partial' | 'refunded';
  // Additional properties used in components
  startDate: string;
  endDate: string;
  pickupLocation: {address: string};
  dropoffLocation: {address: string};
  totalAmount?: number;
}

// Helper function to get address string regardless of input format
export const getAddressString = (address: string | { address: string }): string => {
  if (typeof address === 'string') {
    return address;
  }
  return address.address;
};

// Helper function to convert any address format to object format
export const getAddressObject = (address: string | { address: string }): { address: string } => {
  if (typeof address === 'string') {
    return { address };
  }
  return address;
};

export type ReservationStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface TransportReservation extends Reservation {
  distance?: number;
  duration?: number;
  specialRequests?: string[];
  luggage?: number;
  pickupInstructions?: string;
  additionalStops?: string[];
  needsDriver?: boolean;
  isPaid?: boolean;
  contractGenerated?: boolean;
}

export interface ExtensionRequest {
  id: string;
  reservationId: string;
  requestedBy: string;
  requestedAt: string;
  extraTimeMinutes: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  handledBy?: string;
  handledAt?: string;
  additionalTime?: number; // Added to accommodate existing code
}

export type TransportReservationStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
