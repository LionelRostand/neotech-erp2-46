
export interface Repair {
  id: string;
  vehicleId: string;
  vehicleName: string;
  clientId: string;
  clientName: string;
  mechanicId: string;
  mechanicName: string;
  startDate: string;
  estimatedEndDate: string;
  status: 'awaiting_approval' | 'in_progress' | 'awaiting_parts' | 'completed';
  description: string;
  progress: number;
  estimatedCost: number;
  actualCost?: number;
  notes?: string;
  licensePlate?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  vehicleId: string;
  vehicleName: string;
  date: string;
  time: string;
  duration: number;
  serviceType: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in_progress';
  notes?: string;
  mechanicId?: string;
  mechanicName?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  clientId: string;
  clientName: string;
  color: string;
  mileage: number;
  lastServiceDate?: string;
  status: 'active' | 'inactive' | 'maintenance';
}
