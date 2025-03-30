
import { Note, TransportBasic } from './base-types';

export interface TransportClient extends TransportBasic {
  name?: string;  // For backward compatibility
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  address?: string;
  company?: string;
  vip: boolean;
  loyaltyPoints: number;
  createdAt: string;
  lastBooking?: string;
  totalBookings: number;
  preferredVehicleType?: string;
  notes?: string[];
}

export interface ClientNote extends Note {
  clientId: string;
}
