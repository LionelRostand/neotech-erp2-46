
// Définition des types liés aux cartes pour le module Transport

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface VehicleLocation {
  id: string;
  vehicleId?: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed?: number;
  heading?: number;
  altitude?: number;
  accuracy?: number;
  status?: 'moving' | 'stopped' | 'idle' | 'offline';
  lastUpdate?: string;
  // Support for both naming conventions
  lat?: number;
  lng?: number;
}

export interface TransportVehicleWithLocation {
  id: string;
  name: string;
  type: string;
  licensePlate: string;
  capacity?: number;
  status: string;
  fuelType?: string;
  driverName?: string;
  location: VehicleLocation;
}

export interface MapConfig {
  center: Coordinates;
  zoom: number;
  provider: 'osm' | 'mapbox' | 'google' | 'osm-france' | 'carto';
  style?: string;
  apiKey?: string;
  showTraffic?: boolean;
  showPOIs?: boolean;
  showLabels?: boolean;
  maxZoom?: number;
  minZoom?: number;
  tileProvider?: string;
  refreshInterval?: number;
  showGeofences?: boolean;
}

export interface MapExtensionRequest {
  type: 'traffic' | 'satellite' | 'terrain' | 'heatmap';
  active: boolean;
  config?: Record<string, any>;
}

export interface MapFilter {
  type: 'vehicle' | 'driver' | 'zone';
  value: string;
  active: boolean;
}

export interface LocationHistoryEntry extends Coordinates {
  timestamp: string;
  speed: number;
  status: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'circle' | 'polygon' | 'rectangle';
  coordinates: Coordinates[];
  radius?: number;
  color: string;
  alerts?: boolean;
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
  setTrackingMode: (mode: boolean) => void;
  mapInitialized: boolean;
  mapConfig: MapConfig;
  setMapConfig: (config: MapConfig) => void;
  refreshMap: () => void;
  updateMarkers: (vehicles: TransportVehicleWithLocation[], selectedId?: string) => void;
}

// Type alias for backward compatibility
export type ExtensionRequest = MapExtensionRequest;
