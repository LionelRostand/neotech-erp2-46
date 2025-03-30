
import { TransportBasic, Note } from './base-types';

export interface TransportClient extends TransportBasic {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  taxId?: string;
  paymentMethod?: string;
  defaultVehicleType?: string;
  notes?: string;
  preferredLanguage?: string;
  status?: 'active' | 'inactive' | 'blocked';
  website?: string;
  referralSource?: string;
  loyaltyPoints?: number;
  totalTrips?: number;
  totalSpend?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ClientNote extends Note {
  clientId: string;
}
