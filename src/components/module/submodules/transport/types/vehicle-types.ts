
import { Note, TransportBasic } from './base-types';

export interface TransportVehicle extends TransportBasic {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vinNumber: string;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service' | 'active';
  type: string;
  capacity: number;
  mileage: number;
  fuelType: string;
  fuelLevel: number;
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
  technicianName: string;
  parts?: string[];
  nextServiceDue?: string;
  odometerReading: number;
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
  location: string;
  driverName?: string;
  severity: 'minor' | 'moderate' | 'major';
  status: 'reported' | 'investigating' | 'resolved';
  cost?: number;
  insuranceClaim?: string;
  // For backward compatibility with existing components
  clientName?: string;
  repairCost?: number;
  resolved?: boolean;
  damageDetails?: string;
  insuranceClaim?: boolean; // Adding this for TransportFleet errors
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
