
// vehicle-types.ts
export interface TransportVehicle {
  id: string;
  name: string;
  type: string;
  licensePlate: string;
  status: 'available' | 'maintenance' | 'reserved' | 'unavailable' | 'active' | 'out-of-service';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  mileage?: number;
  capacity?: number;
  available: boolean;
  location?: { lat: number; lng: number };
  purchaseDate?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  notes: any[];
  driverName?: string;
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
  provider?: string;
  nextMaintenance?: string;
  mileage?: number;
  resolved?: boolean;
}

export interface IncidentRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: string;
  description: string;
  location: string;
  reportedBy: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  resolution?: string;
  attachments?: string[];
  severity?: 'low' | 'medium' | 'high' | 'minor' | 'moderate' | 'major';
  driverName?: string;
  clientName?: string;
  damageDescription?: string;
  repairCost?: number;
  insuranceClaim?: boolean;
  resolved?: boolean;
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  scheduledDate: string;
  type: string;
  description: string;
  estimatedDuration: number;
  technicianAssigned?: string; // Made optional to match usage
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
