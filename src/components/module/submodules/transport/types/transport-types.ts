
// Re-export and types that need to be commonly accessible
import { TransportService, TransportServiceDetails } from './service-types';
import { 
  TransportVehicle as VehicleType, 
  MaintenanceRecord as MaintenanceRecordType,
  IncidentRecord as IncidentRecordType
} from './vehicle-types';

// Export service types using export type syntax
export type { TransportService, TransportServiceDetails };

// Re-export utility functions
export { stringToService, serviceToString } from '../utils/service-utils';

// Define TransportDriver interface
export interface TransportDriver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseType: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'active' | 'inactive' | 'on-trip' | 'on-break';
  available: boolean;
  rating: number;
  hireDate: string;
  photo?: string;
  preferredVehicleType?: string;
  notes: any[];
  address?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  performance?: {
    completedTrips: number;
    cancelledTrips: number;
    totalRatings: number;
    averageRating: number;
    totalHours: number;
    totalDistance: number;
  };
  [key: string]: any;
}

// Export TransportVehicle type compatible with both implementations
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
}

// Export MaintenanceRecord type
export interface MaintenanceRecord extends MaintenanceRecordType {
  type: 'regular' | 'emergency' | 'inspection' | 'repair';
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
