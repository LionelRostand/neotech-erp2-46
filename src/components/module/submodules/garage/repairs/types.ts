
export interface GarageService {
  id: string;
  name: string;
  cost: number;
  duration: number;
  description?: string;
}

export interface RepairService {
  serviceId: string;
  quantity: number;
  cost: number;
}

export interface RepairFormData {
  clientId: string;
  vehicleId: string;
  mechanicId: string;
  startDate: string;
  estimatedEndDate: string;
  status: string;
  estimatedCost: number;
  progress: number;
  description: string;
  services: RepairService[];
}
