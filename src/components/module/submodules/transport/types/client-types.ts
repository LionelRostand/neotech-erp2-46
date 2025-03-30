
import { Note } from './base-types';

export interface TransportClient {
  id: string;
  name: string;
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
