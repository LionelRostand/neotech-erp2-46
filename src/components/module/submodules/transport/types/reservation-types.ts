
import { TransportService } from './base-types';

// Define the service types for web booking that match the TransportService.serviceType
export type WebBookingService = 'airport' | 'hourly' | 'pointToPoint' | 'dayTour';

// Define the structure for a web booking
export interface WebBooking {
  id: string;
  service: WebBookingService | TransportService;
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
  vehicleId?: string;
  driverId?: string;
  service?: WebBookingService | TransportService;
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
