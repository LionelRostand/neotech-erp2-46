
import { TransportVehicle } from './vehicle-types';

export interface VehicleLocation {
  vehicleId: string;
  lat?: number;
  lng?: number;
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
  tileProvider?: string;
  showLabels?: boolean;
  centerLat?: number;
  centerLng?: number;
}

export interface MapHookResult {
  mapRef: React.RefObject<any>;
  isLoaded: boolean;
  addMarkers: (vehicles: TransportVehicleWithLocation[]) => void;
  centerOnVehicle: (vehicleId: string) => void;
  refreshMap: () => void;
  map?: any;
  mapInitialized?: boolean;
  mapConfig?: MapConfig;
  setMapConfig?: (config: MapConfig) => void;
  setCenter?: (coords: [number, number]) => void;
  setZoom?: (zoom: number) => void;
}

// Maintenance schedule type that's used in map components
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
  description?: string;
  nextDue?: string;
}

// Extension request type that's used in map components
export interface ExtensionRequest {
  id: string;
  reservationId: string;
  requestedBy: string;
  requestedAt: string;
  extraTimeMinutes: number;
  additionalTime?: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  handledBy?: string;
  handledAt?: string;
  requestId?: string;
  clientName?: string;
  vehicleName?: string;
  originalEndDate?: string;
  requestedEndDate?: string;
  createdAt?: string;
}
