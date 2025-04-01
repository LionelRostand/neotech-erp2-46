
// Définition des types liés aux réservations

import { TransportBasic } from './base-types';

export type TransportReservationStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export type LocationType = 'airport' | 'hotel' | 'address' | 'station' | 'poi';

// Basic transport reservation interface
export interface TransportReservation extends Omit<TransportBasic, 'notes'> {
  clientId: string;
  vehicleId: string;
  driverId?: string;
  status: TransportReservationStatus;
  price: number;
  date?: string;
  time?: string;
  pickup: string | { address: string };
  dropoff: string | { address: string };
  service?: string;
  notes?: string;
  isPaid?: boolean;
  needsDriver?: boolean;
  contractGenerated?: boolean;
}

// For backward compatibility with existing code
export interface Reservation {
  id: string;
  client: string;
  clientName: string;
  vehicle: string;
  driver?: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  startDate: string;
  endDate: string;
  pickupLocation: { address: string };
  dropoffLocation: { address: string };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Web booking specific types
export type WebBookingStatus = 'new' | 'processed' | 'cancelled' | 'confirmed';

export interface WebBookingService {
  id: string;
  name: string;
  price?: number;
  description?: string;
}

export interface WebBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time?: string;
  passengers?: number;
  notes?: string;
  status: WebBookingStatus;
  createdAt: string;
  service: string;
  serviceId: string;
}

// Helper function to get address string
export function getAddressString(location: string | { address: string }): string {
  if (typeof location === 'string') {
    return location;
  }
  return location.address;
}
