
// vehicle-types.ts
export interface TransportVehicle {
  id: string;
  name: string;
  type: string;
  licensePlate: string;
  available: boolean;
  status: 'active' | 'maintenance' | 'out-of-service' | 'reserved' | 'available';
  purchaseDate?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  mileage?: number;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  notes: any[];
  capacity?: number;
  [key: string]: any;
}

export interface VehicleNote {
  id: string;
  vehicleId: string;
  title: string;
  note: string;
  author: string;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'regular' | 'repair' | 'inspection';
  date: string;
  description: string;
  cost: number;
  provider: string;
  performedBy: string;
  nextMaintenance?: string;
  resolved: boolean;
  mileage: number;
  technician: string;
}

export interface IncidentRecord {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  driverName?: string;
  clientName?: string;
  damageDescription?: string;
  repairCost?: number;
  insuranceClaim?: boolean;
  resolved?: boolean;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  type: string;
  location: string;
  reportedBy: string;
  priority: 'low' | 'medium' | 'high';
}

export interface MaintenanceSchedule {
  id?: string;
  vehicleId: string;
  scheduledDate: string;
  type: string;
  description: string;
  estimatedDuration: number;
  technicianAssigned?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  priority?: string;
  taskName?: string;
  nextDue?: string;
  completed?: boolean;
  startDate?: string;
  endDate?: string;
  technician?: string;
  notes?: string | string[];
}

export type MaintenanceScheduleWithTechnician = Omit<MaintenanceSchedule, 'technicianAssigned'> & {
  technicianAssigned: string;
};
