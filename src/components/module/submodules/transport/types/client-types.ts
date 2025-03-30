
import { Note, TransportBasic } from './base-types';

export interface TransportClient extends TransportBasic {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string; // For compatibility with components using name directly
  email: string;
  phone: string;
  address?: string;
  company?: string;
  status: 'active' | 'inactive' | 'blocked';
  loyaltyPoints?: number;
  vipStatus?: boolean;
  preferredVehicleType?: string;
  preferredDriverId?: string;
  notes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientNote extends Note {
  clientId: string;
}
