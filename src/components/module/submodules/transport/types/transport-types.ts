
// Re-export and types that need to be commonly accessible
import { TransportService, TransportServiceDetails } from './service-types';
import { 
  TransportVehicle as VehicleType, 
  MaintenanceRecord as MaintenanceRecordType,
  IncidentRecord as IncidentRecordType
} from './vehicle-types';

// Export service types using export type syntax
export type { TransportService, TransportServiceDetails };

// Define TransportVehicle interface
export interface TransportVehicle extends VehicleType {
  status: 'active' | 'maintenance' | 'inactive' | 'out-of-service' | 'reserved' | 'available';
}

// Export TransportVehicleWithLocation type
export interface TransportVehicleWithLocation extends TransportVehicle {
  driverName?: string;
  location: {
    vehicleId: string;
    coordinates: { latitude: number; longitude: number };
    timestamp: string;
    status: string;
    heading: number;
    speed: number;
  }
}

// Export IncidentRecord type
export interface IncidentRecord extends IncidentRecordType {
  status: 'reported' | 'investigating' | 'resolved' | 'open' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: { latitude: number; longitude: number } | string;
  driverName?: string;
  clientName?: string;
  repairCost?: number;
  resolved?: boolean;
}

// Export MaintenanceRecord type
export interface MaintenanceRecord extends MaintenanceRecordType {
  type: 'regular' | 'emergency' | 'inspection' | 'repair';
  performedBy: string;
  provider?: string;
  nextMaintenance?: string;
}

// Any other types specific to transport module can be defined here
export interface TransportSettings {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  businessHours: {
    open: string;
    close: string;
  };
  defaultCurrency: string;
  taxRate: number;
}
