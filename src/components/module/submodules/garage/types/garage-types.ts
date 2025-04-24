
export interface GarageClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  vehicles?: VehicleReference[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

export interface VehicleReference {
  id: string;
  make: string;
  model: string;
  licensePlate: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  clientId: string;
  mileage: number;
  status: 'available' | 'maintenance';
  lastCheckDate?: string;
  services?: any[];
  repairs?: any[];
  createdAt: string;
  updatedAt?: string;
}
