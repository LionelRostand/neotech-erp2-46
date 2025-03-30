
import { Note } from './base-types';

export interface TransportClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  joinDate: string;
  lastActivityDate?: string;
  totalBookings: number;
  totalSpent: number;
  preferredVehicleTypes?: string[];
  loyaltyActivities?: LoyaltyActivity[];
  notes?: ClientNote[];
}

export enum LoyaltyTier {
  Bronze = 'bronze',
  Silver = 'silver',
  Gold = 'gold',
  Platinum = 'platinum'
}

export interface LoyaltyActivity {
  id: string;
  clientId: string;
  activityType: 'booking' | 'referral' | 'review' | 'promotion';
  description: string;
  pointsEarned: number;
  date: string;
  reservationId?: string;
}

export type ClientNote = Note & {
  clientId: string;
};
