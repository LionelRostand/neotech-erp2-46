
export interface Maintenance {
  id: string;
  date: string;
  clientId: string;
  vehicleId: string;
  mechanicId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  services: Array<{
    serviceId: string;
    quantity: number;
    cost: number;
  }>;
  totalCost: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
