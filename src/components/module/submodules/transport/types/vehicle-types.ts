
import { Note } from './base-types';

export interface TransportVehicle {
  id: string;
  name: string; // Added property
  licensePlate: string;
  make?: string;
  model?: string;
  year?: number;
  type: string;
  capacity: number;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service' | 'active'; // Added 'active'
  features?: string[];
  currentDriverId?: string;
  photo?: string;
  lastServiceDate?: string; // Added property
  nextServiceDate?: string; // Added property
  fuelType?: string;
  fuelLevel?: number;
  mileage?: number;
  purchaseDate?: string; // Added property
  available?: boolean; // Added property
  insuranceInfo?: { // Added property
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
  nextMaintenance?: string; // Added property
  resolved?: boolean; // Added property
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
}

export interface IncidentRecord {
  id: string;
  vehicleId: string;
  date: string;
  driverId?: string;
  driverName?: string; // Added property
  clientName?: string; // Added property
  description: string;
  location?: string;
  severity: 'minor' | 'moderate' | 'major';
  status: 'reported' | 'in-review' | 'resolved';
  insuranceClaim?: boolean;
  claimNumber?: string;
  cost?: number;
  repairCost?: number; // Added property
  resolved?: boolean; // Added property
  damageDetails?: string; // Added property
  attachments?: string[];
}

export interface VehicleNote extends Note {
  vehicleId: string;
}
