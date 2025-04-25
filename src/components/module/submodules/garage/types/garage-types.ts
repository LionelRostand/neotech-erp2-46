
export interface GarageClient {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  status?: 'active' | 'inactive';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vehicle {
  id: string;
  clientId: string;
  make: string;
  model: string;
  year?: number;
  color?: string;
  licensePlate?: string;
  vin?: string;
  fuelType?: string;
  status?: 'active' | 'maintenance' | 'repair' | 'sold';
  mileage?: number;
  lastService?: string;
  nextServiceDue?: string;
  purchaseDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Mechanic {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  specialization?: string;
  status?: 'active' | 'inactive' | 'on_leave';
  hourlyRate?: number;
  startDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Repair {
  id: string;
  vehicleId: string;
  vehicleName?: string;
  vehicleModel?: string;
  clientId: string;
  clientName?: string;
  mechanicId?: string;
  mechanicName?: string;
  service?: string;
  description: string;
  status: 'in_progress' | 'awaiting_parts' | 'completed' | 'cancelled';
  startDate: string;
  estimatedEndDate?: string;
  actualEndDate?: string;
  estimatedCost?: number;
  actualCost?: number;
  partsUsed?: RepairPart[];
  laborHours?: number;
  notes?: string;
  progress?: number;
  invoiceId?: string;
  createdAt?: string;
  updatedAt?: string;
  licensePlate?: string;
}

export interface RepairPart {
  id: string;
  name: string;
  partNumber?: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface GarageAppointment {
  id: string;
  clientId: string;
  clientName: string;
  vehicleId?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  date: string;
  time: string;
  type: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}
