
export interface TransportVehicle {
  id: string;
  name: string;
  type: string;
  model?: string;
  make?: string;
  year?: number;
  licensePlate: string;
  capacity: number;
  status: 'active' | 'maintenance' | 'out-of-service' | 'reserved' | 'available' | 'inactive';
  available: boolean;
  location?: string;
  notes: VehicleNote[];
  maintenanceSchedule?: MaintenanceRecord[];
  incidentRecords?: IncidentRecord[];
  createdAt?: string;
  updatedAt?: string;
  purchaseDate?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  mileage?: number;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  driverName?: string;
}

export interface VehicleNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'regular' | 'emergency' | 'inspection' | 'repair';
  date: string;
  description: string;
  cost: number;
  technician?: string;
  location?: string;
  provider?: string;
  performedBy: string; // Changed from optional to required
  nextMaintenance?: string;
  resolved?: boolean;
  mileage?: number;
}

export interface IncidentRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: string;
  description: string;
  reportedBy: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'resolved' | 'open' | 'closed';
  resolvedAt?: string;
  driverName?: string;
  clientName?: string;
  damageDescription?: string;
  repairCost?: number;
  insuranceClaim?: boolean;
  resolved?: boolean;
  priority?: string;
  location?: string | { latitude: number; longitude: number };
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  scheduledDate: string;
  startDate: string;
  endDate: string;
  type: string;
  description: string;
  estimatedDuration: number;
  technicianAssigned?: string | boolean;
  technician?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  priority?: string;
  taskName?: string;
  nextDue?: string;
  completed?: boolean;
  notes?: string | string[];
}

export interface MaintenanceScheduleWithTechnician extends MaintenanceSchedule {
  technicianName: string;
  technicianContact?: string;
  serviceCenterId?: string;
  serviceCenterName?: string;
}
