
export interface TransportClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vip?: boolean;
  loyaltyPoints?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Loyalty program types
export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum";

export interface LoyaltyMember extends TransportClient {
  points: number;
  tier: LoyaltyTier;
  joinDate: string;
  lastActivity: string;
  vip: boolean;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: "discount" | "free" | "upgrade" | "vip" | "gift";
  validityDays: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoyaltyTransaction {
  id: string;
  memberId: string;
  type: "earn" | "redeem";
  amount: number;
  description: string;
  reservationId?: string;
  rewardId?: string;
  createdAt: string;
}

export interface LoyaltySettings {
  tiers: {
    bronze: { min: number; max: number; benefits: string[] };
    silver: { min: number; max: number; benefits: string[] };
    gold: { min: number; max: number; benefits: string[] };
    platinum: { min: number; benefits: string[] };
  };
  pointsRules: {
    pointsPerEuro: number;
    phoneReservationBonus: number;
    anniversaryBonus: number;
    referralBonus: number;
  };
}
