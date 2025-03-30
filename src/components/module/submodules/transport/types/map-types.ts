
import { TransportVehicle } from './vehicle-types';
import { MaintenanceSchedule } from './vehicle-types';

export interface VehicleLocation {
  vehicleId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp?: string; // Added for TransportGeolocation compatibility
}

export interface TransportVehicleWithLocation extends TransportVehicle {
  location?: VehicleLocation;
}

export interface MapConfig {
  center: { lat: number; lng: number };
  zoom: number;
  style?: string;
  apiKey?: string;
}

export interface MapHookResult {
  isMapLoaded: boolean;
  mapRef: any;
  vehicles: TransportVehicleWithLocation[];
  selectedVehicle: TransportVehicleWithLocation | null;
  setSelectedVehicle: (vehicle: TransportVehicleWithLocation | null) => void;
  zoomToVehicle: (vehicleId: string) => void;
  zoomToFitAllVehicles: () => void;
  trackingMode: boolean;
  setTrackingMode: (mode: boolean) => void;
}

export interface MaintenanceSchedule extends MaintenanceSchedule {
  // Re-exported for convenience - no new properties
}

export interface ExtensionRequest {
  title: string;
  description: string;
  url?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}
