
// Re-export and types that need to be commonly accessible
import { TransportService, TransportServiceDetails } from './service-types';
import { 
  TransportVehicle as VehicleType, 
  MaintenanceRecord as MaintenanceRecordType,
  IncidentRecord as IncidentRecordType
} from './vehicle-types';

// Export service types using export type syntax
export type { TransportService, TransportServiceDetails };

// Define TransportVehicleWithLocation interface
export interface TransportVehicleWithLocation {
  id: string;
  name: string;
  type: string;
  licensePlate: string;
  available: boolean;
  status: 'active' | 'maintenance' | 'out-of-service' | 'reserved' | 'available' | 'inactive';
  purchaseDate?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  mileage?: number;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  notes: any[];
  capacity?: number;
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

// Export IncidentRecord type for transport-types - making it compatible with the vehicle-types definition
export interface IncidentRecord extends Omit<IncidentRecordType, 'status'> {
  status: 'reported' | 'investigating' | 'resolved' | 'open' | 'closed';
  location?: string | { latitude: number; longitude: number };
}

// Export MaintenanceRecord type directly from vehicle-types to ensure they stay in sync
export type MaintenanceRecord = MaintenanceRecordType;

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
