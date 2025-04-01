
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
  notes: VehicleNote[] | any[]; // Updated to be compatible with TransportBasic
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
  notes?: string[];
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
  notes?: string[];
  severity?: 'low' | 'medium' | 'high' | 'critical';
  driverName?: string;
  clientName?: string;
  repairCost?: number;
}

export interface MaintenanceSchedule extends TransportBasic {
  vehicleId: string;
  type: string;
  description: string;
  scheduledDate: string;
  estimatedDuration: number; // in minutes
  status: 'pending' | 'in-progress' | 'scheduled' | 'completed' | 'cancelled';
  notes: any[]; // Updated to be compatible with TransportBasic
  startDate?: string;
  endDate?: string;
  technician?: string;
  technicianAssigned?: boolean;
  completed?: boolean;
}
