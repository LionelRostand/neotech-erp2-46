
// Re-export and types that need to be commonly accessible
import { TransportService, TransportServiceDetails } from './service-types';

// Export service types using export type syntax
export type { TransportService, TransportServiceDetails };

// Re-export utility functions
export { stringToService, serviceToString } from '../utils/service-utils';

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

// Export TransportVehicle type
export interface TransportVehicle {
  id: string;
  name: string;
  type: string;
  licensePlate: string;
  status: 'active' | 'maintenance' | 'inactive';
  available: boolean;
  capacity: number;
  notes: any[];
}

// Export TransportVehicleWithLocation type
export interface TransportVehicleWithLocation extends TransportVehicle {
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
export interface IncidentRecord {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'resolved';
  location?: { latitude: number; longitude: number };
  reportedBy: string;
}

// Export MaintenanceRecord type
export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  type: 'regular' | 'emergency' | 'inspection';
  cost: number;
  performedBy: string;
  notes?: string;
}

// Export TransportReservation type
export interface TransportReservation {
  id: string;
  clientId: string;
  clientName: string;
  driverId?: string;
  driverName?: string;
  vehicleId?: string;
  vehicleName?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  estimatedDropoffTime: string;
  actualDropoffTime?: string;
  price: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'cancelled';
  paymentMethod?: string;
  notes?: string | any[];
  createdAt: string;
  updatedAt: string;
}
