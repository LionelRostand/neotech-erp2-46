
import { TransportReservationStatus, TransportService } from './base-types';

export interface TransportReservation {
  id: string;
  clientId: string;
  vehicleId: string;
  driverId?: string;
  service: TransportService;
  date: string;
  time: string;
  pickup: {
    address: string;
  };
  dropoff: {
    address: string;
  };
  status: TransportReservationStatus;
  price: number;
  isPaid: boolean;
  needsDriver: boolean;
  contractGenerated?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  vehicleId: string;
  driverId?: string;
  clientId: string;
  clientName: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  paymentStatus: "pending" | "partial" | "paid";
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExtensionRequest {
  id: string;
  reservationId: string;
  clientName: string;
  originalEndDate: string;
  requestedEndDate: string;
  vehicleName: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
}

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
  notes?: string;
  status: "new" | "processed" | "confirmed" | "cancelled";
  createdAt: string;
}
