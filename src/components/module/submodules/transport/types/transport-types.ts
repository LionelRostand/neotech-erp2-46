
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

// Export IncidentRecord type for transport-types
export interface IncidentRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: string;
  description: string;
  reportedBy: string;
  status: 'reported' | 'investigating' | 'resolved' | 'open' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string | { latitude: number; longitude: number };
  driverName?: string;
  clientName?: string;
  repairCost?: number;
  resolved?: boolean;
}

// Export MaintenanceRecord type for transport-types
export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'regular' | 'emergency' | 'inspection' | 'repair';
  date: string;
  description: string;
  cost: number;
  performedBy: string;
  provider?: string;
  nextMaintenance?: string;
  location?: string;
  technician?: string;
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
