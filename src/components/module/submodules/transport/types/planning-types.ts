
import { MaintenanceSchedule } from './vehicle-types';
import { ExtensionRequest } from './map-types';

// Type alias for backward compatibility with code using VehicleMaintenanceSchedule
export type VehicleMaintenanceSchedule = MaintenanceSchedule;

// Type alias for backward compatibility with code using MapExtensionRequest
export type MapExtensionRequest = ExtensionRequest;

// Add any other planning-specific types here
export interface PlanningFilter {
  date?: Date;
  vehicleId?: string;
  driverId?: string; 
  status?: string;
}

export interface PlanningItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: 'reservation' | 'maintenance' | 'leave';
  status: string;
  resourceId: string;
  resourceType: 'vehicle' | 'driver';
}
