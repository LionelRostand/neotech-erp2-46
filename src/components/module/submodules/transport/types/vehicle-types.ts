
import { Note, TransportBasic } from './base-types';

export interface TransportVehicle extends TransportBasic {
  make?: string; // Made optional for compatibility
  model?: string; // Made optional for compatibility
  year?: number; // Made optional for compatibility
  licensePlate: string;
  vinNumber?: string; // Made optional for compatibility
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service' | 'active';
  type: string;
  capacity: number;
  mileage: number;
  fuelType?: string; // Made optional for compatibility
  fuelLevel?: number; // Made optional for compatibility
  lastInspection?: string;
  name?: string;
  available?: boolean;
  purchaseDate?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  createdAt?: string; // Added for mockData compatibility
}

export interface VehicleNote extends Note {
  vehicleId: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  date: string;
  description: string;
  cost: number;
  technicianName: string; // Required
  parts?: string[];
  nextServiceDue?: string;
  odometerReading: number; // Required
  // For backward compatibility with existing components
  provider?: string;
  nextMaintenance?: string;
  resolved?: boolean;
}

export interface IncidentRecord {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  location: string; // Required
  driverName?: string;
  severity: 'minor' | 'moderate' | 'major';
  status: 'reported' | 'investigating' | 'resolved';
  cost?: number;
  // For backward compatibility with existing components
  clientName?: string;
  repairCost?: number;
  resolved?: boolean;
  damageDetails?: string;
  insuranceClaim?: boolean | string; // Combined type to handle both use cases
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  scheduledDate: string;
  type: string;
  description: string;
  estimatedDuration: number; // in minutes
  technicianAssigned?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  // Additional fields needed by components
  startDate?: string;
  endDate?: string;
  technician?: string;
  completed?: boolean; // Add for MaintenanceTable
  notes?: string; // Add for mockData
  taskName?: string; // Add for mockData
  priority?: string; // Add for mockData
  nextDue?: string; // Add for mockData
}
