
import { TransportBasic, Note } from './base-types';

export interface TransportVehicle extends TransportBasic {
  name: string;
  type: string;
  licensePlate: string;
  capacity: number;
  year?: number;
  mileage?: number;
  available: boolean;
  status: 'active' | 'maintenance' | 'inactive' | 'reserved';
  nextMaintenanceDate?: string;
  registrationDate?: string;
  insuranceExpiryDate?: string;
  lastInspectionDate?: string;
  fuelType?: string;
  notes: VehicleNote[] | string;
}

export interface VehicleNote extends Note {
  vehicleId: string;
}

export interface MaintenanceRecord extends TransportBasic {
  vehicleId: string;
  type: string;
  description: string;
  date: string;
  odometer?: number;
  cost?: number;
  technician?: string;
  facility?: string;
  notes?: string[];
}

export interface IncidentRecord extends TransportBasic {
  vehicleId: string;
  driverId?: string;
  date: string;
  location?: string;
  description: string;
  damageDescription?: string;
  costEstimate?: number;
  resolved: boolean;
  resolutionDate?: string;
  reportNumber?: string;
  notes?: string[];
}

export interface MaintenanceSchedule extends TransportBasic {
  vehicleId: string;
  type: string;
  description: string;
  scheduledDate: string;
  estimatedDuration: number; // in minutes
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}
