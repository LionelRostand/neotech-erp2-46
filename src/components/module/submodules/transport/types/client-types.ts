
import { Note } from './base-types';

export interface TransportClient {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  vatNumber?: string;
  preferredPaymentMethod?: string;
  loyalty?: {
    points: number;
    tier: string;
    lastActivity: string;
  };
  createdAt: string;
  notes?: string[];
}

export interface LoyaltyTier {
  id: string;
  name: string;
  pointThreshold: number;
  benefits: string[];
  discountPercentage: number;
  color: string;
}

export interface LoyaltyActivity {
  id: string;
  clientId: string;
  date: string;
  type: 'reservation' | 'purchase' | 'reward' | 'referral' | 'adjustment';
  points: number;
  description: string;
  reservationId?: string;
  productId?: string;
}

export interface ClientNote extends Note {
  clientId: string;
}
