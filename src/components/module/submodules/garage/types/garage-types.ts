export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  mileage: number;
  lastCheckDate?: string;
  clientId: string;
  services: string[];
  repairs: string[];
  status: 'available' | 'maintenance';
}

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
  vehicles: string[];
  notes?: string;
  totalSpent: number;
}
