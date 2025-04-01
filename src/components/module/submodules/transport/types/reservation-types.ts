
import { TransportBasic } from './base-types';
import { TransportClient } from './client-types';

export interface Reservation extends TransportBasic {
  client: string;
  clientName: string;
  vehicle: string;
  driver: string;
  startDate: string;
  endDate: string;
  status: string;
  price: number;
  serviceType: string;
  createdAt: string;
  updatedAt?: string;
  pickupLocation?: { address: string };
  dropoffLocation?: { address: string };
  pickup: string;
  dropoff: string;
  isPaid: boolean;
  paymentStatus?: 'paid' | 'unpaid' | 'partial' | 'refunded';
  notes: any[]; // Updated to be compatible with TransportBasic
}

export interface TransportReservation extends TransportBasic {
  clientId: string;
  clientName: string;
  vehicleId: string;
  driverId?: string;
  pickup: string;
  dropoff: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  price: number;
  isPaid: boolean;
  paymentMethod?: string;
  specialRequirements?: string;
  notes: any[]; // Updated to be compatible with TransportBasic
  createdAt: string;
  updatedAt?: string;
}

export interface ReservationFilter {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  client?: string;
  vehicle?: string;
  driver?: string;
}

export function getAddressString(address: string | { address: string }): string {
  if (typeof address === 'string') {
    return address;
  }
  return address?.address || '';
}

export type TransportReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';

export interface Address {
  address: string;
  lat?: number;
  lng?: number;
}
