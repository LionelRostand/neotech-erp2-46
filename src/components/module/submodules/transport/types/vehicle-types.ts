
import { Note } from './base-types';

export interface TransportVehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  type: string;
  capacity: number;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  features: string[];
  currentDriverId?: string;
  photo?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  fuelType: string;
  fuelLevel: number;
  mileage: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: string;
  description: string;
  cost: number;
  provider: string;
  mileage: number;
  attachments?: string[];
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  taskName: string;
  intervalType: 'time' | 'mileage';
  timeInterval?: number; // in days
  mileageInterval?: number; // in miles/km
  lastPerformed: string;
  lastMileage: number;
  nextDue: string;
  estimatedNextMileage: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  cost?: number;
}

export interface IncidentRecord {
  id: string;
  vehicleId: string;
  date: string;
  driverId?: string;
  description: string;
  location?: string;
  severity: 'minor' | 'moderate' | 'major';
  status: 'reported' | 'in-review' | 'resolved';
  insuranceClaim?: boolean;
  claimNumber?: string;
  cost?: number;
  attachments?: string[];
}

export interface VehicleNote extends Note {
  vehicleId: string;
}
