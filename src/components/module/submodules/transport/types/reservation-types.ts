
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
