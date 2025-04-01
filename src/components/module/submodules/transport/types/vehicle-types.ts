
import { TransportBasic, Note } from './base-types';

export interface TransportVehicle extends TransportBasic {
  name: string;
  type: string;
  licensePlate: string;
  capacity: number;
  year?: number;
  mileage?: number;
  available: boolean;
  status: 'active' | 'maintenance' | 'inactive' | 'reserved' | 'out-of-service';
  nextMaintenanceDate?: string;
  registrationDate?: string;
  insuranceExpiryDate?: string;
  lastInspectionDate?: string;
  fuelType?: string;
  notes: VehicleNote[] | any[]; // Allow empty arrays for mock data
  purchaseDate?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
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
  notes?: string[] | any[]; // Updated to be compatible with both string[] and any[]
  provider?: string;
  nextMaintenance?: string;
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
  notes?: string[] | any[]; // Updated to be compatible with both string[] and any[]
  severity?: 'low' | 'medium' | 'high' | 'critical';
  driverName?: string;
  clientName?: string;
  repairCost?: number;
}

// Modified to be compatible with VehicleMaintenanceSchedule
export interface MaintenanceSchedule extends Omit<TransportBasic, 'notes'> {
  vehicleId: string;
  type: string;
  description: string;
  scheduledDate: string;
  estimatedDuration: number; // in minutes
  status: 'pending' | 'in-progress' | 'scheduled' | 'completed' | 'cancelled';
  notes: any[] | string; // Accept both array and string for compatibility
  startDate?: string;
  endDate?: string;
  technician?: string;
  technicianAssigned?: string | boolean; // Accept both string and boolean
  completed?: boolean;
}
