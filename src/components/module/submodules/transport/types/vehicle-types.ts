
// vehicle-types.ts
export interface TransportVehicle {
  id: string;
  name: string;
  type: string;
  licensePlate: string;
  status: 'available' | 'maintenance' | 'reserved' | 'unavailable';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  mileage?: number;
  capacity?: number;
  available: boolean;
  location?: { lat: number; lng: number };
  [key: string]: any; // Allow for additional properties
}

export interface VehicleNote {
  id: string;
  vehicleId: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: string;
  cost: number;
  description: string;
  technician: string;
  notes?: string;
  partsCost?: number;
  laborCost?: number;
  attachments?: string[];
}

export interface IncidentRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: string;
  description: string;
  location: string;
  reportedBy: string;
  status: 'open' | 'investigating' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  resolution?: string;
  attachments?: string[];
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  scheduledDate: string;
  type: string;
  description: string;
  estimatedDuration: number;
  technicianAssigned?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority?: string;
  taskName?: string;
  nextDue?: string;
  completed?: boolean;
  startDate?: string;
  endDate?: string;
  technician?: string;
  notes?: string | string[];
}
