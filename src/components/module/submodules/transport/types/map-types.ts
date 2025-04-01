
import { TransportVehicle } from './vehicle-types';

// Define map-related types for the Transport module
export interface VehicleLocation {
  lat: number;
  lng: number;
  timestamp: string;
  speed?: number;
  heading?: number;
  accuracy?: number;
}

// Combine vehicle with location data
export interface TransportVehicleWithLocation extends TransportVehicle {
  location?: VehicleLocation;
  isMoving?: boolean;
  lastUpdate?: string;
}

export interface MapConfig {
  center: [number, number]; // [lat, lng]
  zoom: number;
  showTraffic?: boolean;
  showGeofences?: boolean;
  refreshInterval?: number;
  maxZoom?: number;
  minZoom?: number;
  tileProvider?: 'osm' | 'mapbox' | 'google';
}

export interface MapHookResult {
  mapRef: React.RefObject<HTMLDivElement>;
  isMapLoaded: boolean;
  vehicles: TransportVehicleWithLocation[];
  selectedVehicle: TransportVehicleWithLocation | null;
  setSelectedVehicle: (vehicle: TransportVehicleWithLocation | null) => void;
  loading: boolean;
  error: Error | null;
  zoomToVehicle: (vehicleId: string) => void;
  zoomToFitAllVehicles: () => void;
  trackingMode: boolean;
  setTrackingMode: (enabled: boolean) => void;
  // Additional properties for advanced functionality
  mapInitialized?: boolean;
  mapConfig?: MapConfig;
  setMapConfig?: (config: MapConfig) => void;
  refreshMap?: () => void;
  updateMarkers?: (vehicles: TransportVehicleWithLocation[], selectedId?: string) => void;
}

export interface ExtensionRequest {
  id: string;
  name: string;
  description: string;
  requestedBy: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
}

export type MapExtensionRequest = ExtensionRequest;
