
// Basic client types for TransportLoyalty component
export interface TransportClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  loyaltyPoints?: number;
  memberSince?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  lastRide?: string;
  totalRides?: number;
}

export interface LoyaltyTier {
  name: string;
  pointsRequired: number;
  benefits: string[];
  color: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  available: boolean;
  image?: string;
}
