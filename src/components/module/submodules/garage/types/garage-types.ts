
export interface GarageClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  status: string;
  vehicles: VehicleSummary[];
  createdAt: string;
  updatedAt?: string;
}

export interface VehicleSummary {
  id: string;
  make: string;
  model: string;
  year?: number;
  licensePlate: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  mileage?: number;
  lastService?: string;
  nextService?: string;
  clientId: string;
  status: 'active' | 'inactive' | 'maintenance' | 'available' | 'reserved';
  notes?: string;
  lastCheckDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Repair {
  id: string;
  vehicleId: string;
  clientId: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  cost?: number;
  mechanicId?: string;
  parts?: RepairPart[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RepairPart {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  inventoryId?: string;
}

export interface Mechanic {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization?: string;
  status: 'active' | 'inactive' | 'on_leave';
  hireDate: string;
  terminationDate?: string;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  vehicleId: string;
  serviceIds: string[];
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  mechanicId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Inventory {
  id: string;
  name: string;
  category: string;
  reference: string;
  price: number;
  costPrice?: number;
  quantity: number;
  minimumQuantity?: number;
  supplier?: string;
  location?: string;
  description?: string;
  lastOrderDate?: string;
  createdAt: string;
  updatedAt?: string;
}
