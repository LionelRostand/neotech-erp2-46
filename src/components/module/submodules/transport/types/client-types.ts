
// Define client-related types for the Transport module

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  lastActivity?: string;
  loyaltyPoints: number;
  status: 'active' | 'inactive';
}

export interface LoyaltyTransaction {
  id: string;
  clientId: string;
  points: number;
  type: 'earn' | 'redeem';
  description: string;
  date: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  available: boolean;
}

export interface ClientFilters {
  status?: string;
  loyaltyTier?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Adding these types for compatibility with the existing imports
export interface TransportClient extends Client {
  // Additional properties from index.ts import
}

export interface ClientNote {
  id: string;
  clientId: string;
  content: string;
  createdAt: string;
  createdBy: string;
}
