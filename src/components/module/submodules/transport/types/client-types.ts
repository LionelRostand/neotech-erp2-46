
import { Note } from './base-types';

export type ClientNote = Note & {
  clientId: string;
};

export enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

export interface LoyaltyActivity {
  id: string;
  clientId: string;
  date: string;
  type: 'ride' | 'referral' | 'review' | 'promotion' | 'other';
  description: string;
  pointsEarned: number;
  pointsSpent: number;
  balance: number;
}

export interface TransportClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  loyaltyTier?: LoyaltyTier;
  loyaltyPoints?: number;
  registrationDate: string;
  lastActivity?: string;
  totalRides?: number;
  preferredVehicleTypes?: string[];
  notes?: ClientNote[];
  status: 'active' | 'inactive' | 'blocked';
}
