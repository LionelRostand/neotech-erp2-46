
import { TransportVehicle } from './vehicle-types';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface VehicleLocation {
  vehicleId: string;
  coordinates: Coordinates;
  timestamp: string;
  status: 'moving' | 'idle' | 'stopped';
  speed: number;
  heading: number;
  // For compatibility
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  lastUpdate?: string;
}

export interface TransportVehicleWithLocation extends TransportVehicle {
  location: VehicleLocation;
  capacity: number;
  driverName?: string;
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  style: string;
  markers?: MapMarker[];
}

export interface MapMarker {
  id: string;
  position: [number, number];
  type: 'vehicle' | 'client' | 'depot';
  status?: string;
  title?: string;
  iconUrl?: string;
}

export interface MapHookResult {
  mapContainer: React.RefObject<HTMLDivElement>;
  initializeMap: () => mapboxgl.Map | null;
  addVehiclesToMap: (vehicles: TransportVehicleWithLocation[], onClick: (vehicle: TransportVehicleWithLocation) => void) => void;
}

export interface MapExtensionRequest {
  id: string;
  requestId: string;
  clientName: string;
  vehicleName: string;
  originalEndDate: string;
  requestedEndDate: string;
  reason: string;
  extensionReason?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  type: string;
  active: boolean;
}
