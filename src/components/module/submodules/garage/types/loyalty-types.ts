
export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsPerEuro: number;
  rewardThreshold: number;
  discount: number;
  type: 'percentage' | 'fixed' | 'points';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

export interface LoyaltyCustomer {
  id: string;
  customerId: string;
  customerName: string;
  points: number;
  totalSpent: number;
  rewardsRedeemed: number;
  lastTransaction?: string;
  memberSince: string;
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  transactionId: string;
  programId: string;
  pointsEarned: number;
  pointsRedeemed: number;
  date: string;
  invoiceAmount: number;
}
