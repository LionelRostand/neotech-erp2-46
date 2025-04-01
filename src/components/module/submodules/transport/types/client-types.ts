
// Définition des types liés aux clients pour le module de transport

export interface TransportClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'blocked';
  type: 'individual' | 'corporate';
  loyaltyPoints?: number;
  preferredPaymentMethod?: string;
}

export interface ClientAddress {
  id: string;
  clientId: string;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export interface ClientPreference {
  id: string;
  clientId: string;
  preferredVehicleType?: string;
  preferredDriver?: string;
  specialRequirements?: string;
  communicationPreference?: 'email' | 'sms' | 'phone';
  languagePreference?: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsPerEuro: number;
  minimumPointsForRedemption: number;
  redemptionRatePerPoint: number;
  rules: string[];
  tiers: LoyaltyTier[];
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minimumPoints: number;
  benefits: string[];
  discountPercentage: number;
}

export interface LoyaltyTransaction {
  id: string;
  clientId: string;
  date: string;
  type: 'earn' | 'redeem' | 'expire' | 'adjust';
  points: number;
  reason: string;
  reservationId?: string;
}
