export interface GarageClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  vehicles: string[];
  lastVisit?: string;
  totalSpent: number;
  notes?: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface Vehicle {
  id: string;
  clientId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  services: string[];
  repairs: string[];
}

export interface Appointment {
  id: string;
  clientId: string;
  vehicleId: string;
  date: string;
  time: string;
  services: string[];
  notes: string;
  status: 'scheduled' | 'inProgress' | 'completed' | 'cancelled';
}

export interface Repair {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  parts: string[];
  laborCost: number;
  totalCost: number;
  status: 'pending' | 'inProgress' | 'completed';
}

export interface Invoice {
  id: string;
  clientId: string;
  date: string;
  services: string[];
  parts: string[];
  laborCost: number;
  totalCost: number;
  paymentStatus: 'paid' | 'unpaid' | 'partial';
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  partsSupplied: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  supplierId: string;
  quantity: number;
  costPerUnit: number;
  sellingPrice: number;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsPerDollar: number;
  rewards: string[];
}

export interface GarageSettings {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  servicesOffered: string[];
}
