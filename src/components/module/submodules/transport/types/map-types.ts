
import { TransportVehicle } from './vehicle-types';
// Remove conflicting import
// import { MaintenanceSchedule } from './vehicle-types';

export interface VehicleLocation {
  vehicleId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp?: string; // For TransportGeolocation compatibility
  // Add properties used by components
  latitude?: number; // For backward compatibility
  longitude?: number; // For backward compatibility
  lastUpdate?: string;
  status?: string;
}

export interface TransportVehicleWithLocation extends TransportVehicle {
  location?: VehicleLocation;
  driverName?: string; // Add for VehicleDetailsDialog
}

export interface MapConfig {
  center: { lat: number; lng: number };
  zoom: number;
  style?: string;
  apiKey?: string;
  // Add properties used in hooks
  maxZoom?: number;
  minZoom?: number;
  tileProvider?: string;
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
  // Add properties used in components
  mapInitialized?: boolean;
  mapConfig?: MapConfig;
  setMapConfig?: (config: MapConfig) => void;
  refreshMap?: () => void;
  updateMarkers?: (vehicles: TransportVehicleWithLocation[], selectedId?: string) => void;
}

// Fix the re-export by defining the interface explicitly
export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  scheduledDate: string;
  type: string;
  description: string;
  estimatedDuration: number;
  technicianAssigned?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  // Additional fields
  startDate?: string;
  endDate?: string;
  technician?: string;
  completed?: boolean;
  notes?: string;
  taskName?: string;
  priority?: string;
  nextDue?: string;
}

export interface ExtensionRequest {
  title: string;
  description: string;
  url?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  // Add missing properties used in components
  id?: string;
  requestId?: string;
  clientName?: string;
  vehicleName?: string;
  originalEndDate?: string;
  requestedEndDate?: string;
  reason?: string;
  extensionReason?: string;
  createdAt?: string;
}
