
import { TransportVehicle } from './vehicle-types';

export interface VehicleLocation {
  vehicleId: string;
  latitude: number;
  longitude: number;
  // Add lat/lng properties for compatibility
  lat?: number;
  lng?: number;
  speed: number;
  direction: number;
  timestamp: string;
  lastUpdate?: string;
  address?: string;
  status: string;
  heading?: number; // Added heading property
}

export interface TransportVehicleWithLocation extends TransportVehicle {
  location: VehicleLocation;
  driverName?: string;
  color?: string;
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  showTraffic: boolean;
  showGeofences: boolean;
  refreshInterval: number;
  // Add missing properties
  maxZoom?: number;
  minZoom?: number;
  tileProvider?: string;
  showLabels?: boolean; // Added showLabels property
}

export interface MapHookResult {
  vehicles: TransportVehicleWithLocation[];
  selectedVehicle: TransportVehicleWithLocation | null;
  setSelectedVehicle: (vehicle: TransportVehicleWithLocation | null) => void;
  loading: boolean;
  error: string | null;
  // Add missing properties
  mapRef?: React.RefObject<HTMLDivElement>;
  isMapLoaded?: boolean;
  zoomToVehicle?: (vehicleId: string) => void;
  zoomToFitAllVehicles?: () => void;
  trackingMode?: boolean;
  setTrackingMode?: (mode: boolean) => void;
  mapInitialized?: boolean;
  mapConfig?: MapConfig;
  setMapConfig?: (config: MapConfig) => void;
  refreshMap?: () => void;
  updateMarkers?: (vehicles: TransportVehicleWithLocation[], selectedId?: string) => void;
}

export interface ExtensionRequest {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehicleName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedExtension: number; // in hours
  originalEndTime: string;
  newEndTime: string;
  timestamp: string;
  responseMessage?: string;
  // Add missing properties used in components
  requestId?: string;
  clientName?: string;
  originalEndDate?: string;
  requestedEndDate?: string;
  extensionReason?: string;
  createdAt?: string;
  reservationId?: string;
  requestDate?: string; // Added requestDate property
  requestedAt?: string;
  extraTimeMinutes?: number;
  additionalTime?: number;
  extensionDays?: number;
}

