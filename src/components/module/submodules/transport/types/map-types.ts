
import { TransportVehicle } from './vehicle-types';

export interface VehicleLocation {
  vehicleId: string;
  latitude: number;
  longitude: number;
  heading: number;
  timestamp: string;
  speed?: number;
  status?: string;
  lastUpdate?: string;
}

export interface TransportVehicleWithLocation extends TransportVehicle {
  location: VehicleLocation;
  driverName?: string;
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  style?: string;
  minZoom?: number;
  maxZoom?: number;
}

export interface MapHookResult {
  mapRef: React.RefObject<any>;
  isLoaded: boolean;
  addMarkers: (vehicles: TransportVehicleWithLocation[]) => void;
  centerOnVehicle: (vehicleId: string) => void;
  refreshMap: () => void;
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  taskName: string;
  startDate: string;
  endDate: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  technician?: string;
  completed: boolean;
  notes?: string;
}

export interface ExtensionRequest {
  id: string;
  reservationId: string;
  requestedBy: string;
  requestedAt: string;
  extraTimeMinutes: number;
  additionalTime?: number; // Add this field to match usage in code
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  handledBy?: string;
  handledAt?: string;
}
