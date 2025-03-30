
import { TransportVehicle } from "./vehicle-types";

export interface VehicleLocation {
  vehicleId: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  timestamp: string;
  status: 'idle' | 'driving' | 'stopped';
  // Additional properties used in components
  lat?: number; 
  lng?: number;
  lastUpdate?: string;
}

export interface TransportVehicleWithLocation extends TransportVehicle {
  location: VehicleLocation;
  driverName?: string; // Added property
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  tileProvider: string;
  apiKey?: string;
  // Additional properties used in components
  showLabels?: boolean;
  centerLat?: number;
  centerLng?: number;
}

export interface MapHookResult {
  map: any;
  isLoaded: boolean;
  setCenter: (coords: [number, number]) => void;
  setZoom: (zoom: number) => void;
  addMarker: (coords: [number, number], options?: any) => any;
  removeMarker: (marker: any) => void;
  drawRoute: (points: [number, number][], options?: any) => any;
  clearRoute: (route: any) => void;
  // Additional properties used in components
  mapInitialized?: boolean;
  mapConfig?: MapConfig;
  setMapConfig?: (config: MapConfig) => void;
  refreshMap?: () => void;
}

// For backward compatibility
export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  taskName: string;
  nextDue: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ExtensionRequest {
  id: string;
  reservationId: string;
  status: 'pending' | 'approved' | 'rejected';
  // Additional fields used in components
  requestId?: string;
  clientName?: string;
  vehicleName?: string;
  originalEndDate?: string;
  requestedEndDate?: string;
  reason?: string;
  requestedAt?: string;
  requestedBy?: string;
  createdAt?: string;
}
