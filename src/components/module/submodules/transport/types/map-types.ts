
import { TransportVehicle } from './vehicle-types';
import { MaintenanceSchedule } from './vehicle-types';

export interface VehicleLocation {
  latitude: number;
  longitude: number;
  lat?: number; // For compatibility with map libraries
  lng?: number; // For compatibility with map libraries
  speed?: number;
  heading?: number;
  lastUpdate?: string;
}

export interface TransportVehicleWithLocation extends TransportVehicle {
  location: VehicleLocation;
  driverName?: string;
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  maxZoom?: number;
  minZoom?: number;
  tileProvider?: string;
  showLabels?: boolean;
}

export interface MapHookResult {
  mapRef: React.RefObject<HTMLDivElement>;
  mapInitialized: boolean;
  setMapConfig: (config: MapConfig) => void;
  refreshMap: () => void;
}

export { MaintenanceSchedule };

export interface ExtensionRequest {
  id: string;
  vehicleId: string;
  requestId?: string;
  requestDate: string;
  requestedEndDate?: string;
  originalEndDate?: string;
  extensionReason: string;
  extensionDays: number;
  status: 'pending' | 'approved' | 'denied' | 'rejected';
  approvedBy?: string;
  notes?: string;
  vehicleName?: string;
  clientName?: string;
  reason?: string;
  createdAt?: string;
  reservationId?: string;
}
