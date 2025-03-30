
import { TransportDriver } from './base-types';
import { Note } from './base-types';

export interface TransportVehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  licensePlate: string;
  available: boolean;
  status: string;
  color?: string;
  fuelType?: string;
  currentDriverId?: string;
  currentDriver?: TransportDriver;
  maintenanceRecords?: MaintenanceRecord[];
  incidentRecords?: IncidentRecord[];
  notes?: VehicleNote[];
}

export type VehicleNote = Note & {
  vehicleId: string;
};

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  date: string;
  description: string;
  cost: number;
  provider: string;
  nextMaintenance?: string;
  mileage?: number; // Make mileage optional
  resolved: boolean;
}

export interface IncidentRecord {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  severity: string;
  driverName?: string;
  clientName?: string;
  damageDetails?: string;
  repairCost?: number;
  insuranceClaim?: boolean;
  status: string; // Add required status property
  resolved: boolean;
}

// Add MaintenanceSchedule to avoid conflicts with the one in map-types
export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  taskName: string;
  startDate?: string;
  endDate: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  technician?: string;
  completed: boolean;
  notes?: string;
  description?: string;
}
