
// Basic types for the garage module

export interface GarageClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'lead';
  createdAt: string;
}

export interface Vehicle {
  id: string;
  clientId: string;
  brand: string;
  model: string;
  year: number;
  registrationNumber: string;
  vin?: string;
  color?: string;
  fuelType?: string;
  mileage?: number;
  lastServiceDate?: string;
  status: 'active' | 'maintenance' | 'retired';
  notes?: string;
  createdAt: string;
}

export interface Mechanic {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  experienceYears?: number;
  certifications?: string[];
  status: 'active' | 'inactive' | 'vacation';
  notes?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  cost: number;
  duration: number; // in minutes
  status: 'active' | 'inactive';
  category?: string;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  clientId: string;
  vehicleId: string;
  mechanicId: string;
  services: string[]; // Array of service IDs
  date: string;
  endDate?: string;
  description: string;
  cost: number;
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Inventory {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  supplierId?: string;
  location?: string;
  notes?: string;
  createdAt: string;
}
