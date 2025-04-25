
export interface GarageClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  clientId: string;
  type: string;
  status: 'available' | 'maintenance' | 'repair';
}

export interface Mechanic {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  status: 'available' | 'busy' | 'onBreak';
}

export interface Repair {
  id: string;
  clientId: string;
  vehicleId: string;
  mechanicId: string;
  licensePlate: string;
  startDate: string;
  endDate: string;
  description: string;
  estimatedCost: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}
