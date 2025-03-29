
import { Note } from './base-types';
import { MaintenanceSchedule as MapMaintenanceSchedule } from './map-types';

export interface TransportVehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  licensePlate: string;
  available: boolean;
  status: "active" | "maintenance" | "out-of-service";
  color?: string;
  fuelType?: string;
  mileage?: number;
  purchaseDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  insuranceExpiryDate?: string;
  notes?: string;
  // Additional properties needed by components
  lastServiceDate?: string;
  nextServiceDate?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
}

// Use the MaintenanceSchedule type from map-types.ts to avoid duplication
export type MaintenanceSchedule = MapMaintenanceSchedule;

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: "regular" | "repair" | "inspection";
  date: string;
  description: string;
  cost: number;
  provider: string;
  nextMaintenance: string;
  resolved: boolean;
}

export interface IncidentRecord {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  severity: "minor" | "moderate" | "major";
  driverName: string;
  clientName: string;
  damageDetails: string;
  repairCost: number;
  insuranceClaim: boolean;
  resolved: boolean;
}

export interface VehicleNote extends Note {
  vehicleId: string;
}
