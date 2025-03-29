
import { TransportVehicle } from './transport-types';

export interface VehicleLocation {
  lat: number;
  lng: number;
  lastUpdate: string;
  speed: number;
  status: string;
}

export interface TransportVehicleWithLocation extends TransportVehicle {
  location?: VehicleLocation;
}

export interface MapConfig {
  zoom: number;
  centerLat: number;
  centerLng: number;
  tileProvider: 'osm' | 'osm-france' | 'carto';
  showLabels: boolean;
}

export interface MapHookResult {
  mapInitialized: boolean;
  mapConfig: MapConfig;
  setMapConfig: React.Dispatch<React.SetStateAction<MapConfig>>;
  refreshMap: () => void;
}

// Maintenance Schedule type for planning
export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  type: 'regular' | 'repair' | 'inspection';
  startDate: string;
  endDate: string;
  description: string;
  technician?: string;
  notes?: string;
  completed: boolean;
}

// Extension request type for planning
export interface ExtensionRequest {
  id: string;
  requestId: string;
  clientName: string;
  vehicleName: string;
  originalEndDate: string;
  requestedEndDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
