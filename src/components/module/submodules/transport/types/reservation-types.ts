
import { TransportBasic } from './base-types';
import { TransportService } from './base-types';
import { WebBookingService } from './integration-types';

export interface TransportReservation extends TransportBasic {
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
  totalAmount: number;
  isPaid: boolean;
  status: string;
  notes?: string;
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
