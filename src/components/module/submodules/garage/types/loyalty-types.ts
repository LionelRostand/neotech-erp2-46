
export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsMultiplier: number;
  minimumSpend: number;
  benefitsDescription: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'upcoming';
  createdAt: string;
}
