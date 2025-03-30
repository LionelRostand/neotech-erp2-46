
import { Note } from './base-types';

export interface TransportVehicle {
  id: string;
  name: string;
  licensePlate: string;
  make?: string;
  model?: string;
  year?: number;
  type: string;
  capacity: number;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service' | 'active';
  features?: string[];
  currentDriverId?: string;
  photo?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  fuelType?: string;
  fuelLevel?: number;
  mileage?: number;
  purchaseDate?: string;
  available?: boolean;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  color?: string;
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
  nextMaintenance?: string;
  resolved?: boolean;
  attachments?: string[];
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  taskName: string;
  intervalType?: 'time' | 'mileage';
  timeInterval?: number; // in days
  mileageInterval?: number; // in miles/km
  lastPerformed?: string;
  lastMileage?: number;
  nextDue: string;
  estimatedNextMileage?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  cost?: number;
  // Additional fields used in components
  startDate?: string;
  endDate?: string;
  type?: string;
  technician?: string;
  completed?: boolean;
  notes?: string;
}

export interface IncidentRecord {
  id: string;
  vehicleId: string;
  date: string;
  driverId?: string;
  driverName?: string;
  clientName?: string;
  description: string;
  location?: string;
  severity: 'minor' | 'moderate' | 'major';
  status: 'reported' | 'in-review' | 'resolved';
  insuranceClaim?: boolean;
  claimNumber?: string;
  cost?: number;
  repairCost?: number;
  resolved?: boolean;
  damageDetails?: string;
  attachments?: string[];
}

export interface VehicleNote extends Note {
  vehicleId: string;
}
