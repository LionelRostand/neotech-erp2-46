
import { TransportVehicle, TransportDriver } from './index';

export interface VehicleMaintenanceSchedule {
  id: string;
  vehicleId: string;
  scheduledDate: string;
  type: string;
  description: string;
  estimatedDuration: number; // in minutes
  technicianAssigned: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: string;
  taskName: string;
  nextDue: string;
  completed: boolean;
  startDate: string;
  endDate: string;
  technician: string;
  notes?: string;
}

// Make more properties optional for compatibility with mockData
export interface MapExtensionRequest {
  id: string;
  reservationId?: string;
  vehicleId: string;
  vehicleName: string;
  driverId?: string; // Made optional
  driverName?: string; // Made optional
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  requestedExtension?: number; // in hours, made optional
  originalEndTime?: string; // Made optional
  newEndTime?: string; // Made optional
  timestamp?: string; // Made optional
  // Additional properties for mockData compatibility
  requestId?: string;
  clientName?: string;
  originalEndDate?: string;
  requestedEndDate?: string;
  extensionReason?: string;
  createdAt?: string;
  requestDate?: string;
  requestedAt?: string;
  extraTimeMinutes?: number;
  additionalTime?: number;
  extensionDays?: number;
  responseMessage?: string;
}

export interface PlanningFilter {
  status?: string[];
  date?: {
    start: string;
    end: string;
  };
  vehicleType?: string[];
  driverId?: string[];
  priority?: string[];
}

export interface PlanningItem {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  status: string;
  type: 'reservation' | 'maintenance' | 'extension';
  vehicleId: string;
  driverId?: string;
  priority?: string;
}
