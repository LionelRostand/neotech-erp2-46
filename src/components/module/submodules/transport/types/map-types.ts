
import { TransportVehicle } from './vehicle-types';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface VehicleLocation {
  vehicleId: string;
  coordinates: Coordinates;
  timestamp: string;
  status: 'offline' | 'idle' | 'moving' | 'stopped';
  heading?: number;
  speed?: number;
  // Add these properties to support both coordinate access patterns
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  lastUpdate?: string;
}

export interface TransportVehicleWithLocation extends TransportVehicle {
  location?: VehicleLocation;
  driverName?: string; // Add this property to match usage
}

export interface MapConfig {
  center: Coordinates;
  zoom: number;
  showTraffic?: boolean;
  showGeofences?: boolean;
  refreshInterval?: number;
  provider?: 'osm' | 'google' | 'mapbox';
  maxZoom?: number;
  minZoom?: number;
  tileProvider?: string;
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
  mapInitialized?: boolean;
  mapConfig?: MapConfig;
  setMapConfig?: (config: MapConfig) => void;
  refreshMap?: () => void;
  updateMarkers?: (vehicles: TransportVehicleWithLocation[]) => void;
}

export interface MapExtensionRequest {
  id: string;
  requestId: string;
  type: 'traffic' | 'satellite' | 'terrain' | 'heatmap';
  active: boolean;
  config?: Record<string, any>;
  status?: 'pending' | 'approved' | 'rejected';
  clientName?: string;
  vehicleName?: string;
  originalEndDate?: string;
  requestedEndDate?: string;
  reason?: string;
  extensionReason?: string;
  createdAt?: string;
}
