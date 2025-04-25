
export interface Service {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number;
  status: string;
  categoryId?: string;
  canBeUsedIn?: {
    vehicles: boolean;
    appointments: boolean;
    repairs: boolean;
    invoices: boolean;
    mechanics: boolean;
    suppliers: boolean;
    inventory: boolean;
  };
}

export interface Repair {
  id: string;
  vehicleId: string;
  vehicleName?: string;
  clientId: string;
  clientName?: string;
  mechanicId: string;
  mechanicName?: string;
  startDate: string;
  date?: string;
  estimatedEndDate?: string;
  endDate?: string;
  status: string;
  description: string;
  progress: number;
  estimatedCost: number;
  actualCost?: number;
  licensePlate?: string;
  vehicleInfo?: string;
}

export interface Mechanic {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  specialization?: string[] | string;
  status?: string;
  photo?: string;
  hireDate?: string;
  certifications?: string[];
  ratings?: number;
  assignedRepairs?: string[];
}
