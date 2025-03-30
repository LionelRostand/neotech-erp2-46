import { Note } from './base-types';

export interface TransportDriver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: string;
  rating: number;
}

export interface TransportVehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  licensePlate: string;
  available: boolean;
  status: "available" | "in-use" | "maintenance" | "out-of-service" | "active";
  color?: string;
  fuelType?: string;
  currentDriverId?: string;
  currentDriver?: TransportDriver;
  maintenanceRecords?: MaintenanceRecord[];
  incidentRecords?: IncidentRecord[];
  notes?: VehicleNote[];
  purchaseDate?: string;
  mileage?: number;
  lastServiceDate?: string;
  nextServiceDate?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
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
  mileage?: number;
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
  status: string;
  resolved: boolean;
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  taskName: string;
  startDate: string;
  endDate: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  technician?: string;
  completed: boolean;
  notes?: string;
  description?: string;
  nextDue?: string;
}
