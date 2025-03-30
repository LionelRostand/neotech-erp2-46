
import { TransportVehicle } from './vehicle-types';

export interface VehicleLocation {
  vehicleId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed?: number;
  heading?: number;
  status?: string;
}

export interface TransportVehicleWithLocation extends TransportVehicle {
  location: VehicleLocation;
}

export interface MapConfig {
  center: [number, number]; // [latitude, longitude]
  zoom: number;
  showTraffic: boolean;
  showControls: boolean;
}

export interface MapHookResult {
  mapContainer: React.RefObject<HTMLDivElement>;
  vehicles: TransportVehicleWithLocation[];
  selectedVehicle: TransportVehicleWithLocation | null;
  setSelectedVehicle: (vehicle: TransportVehicleWithLocation | null) => void;
  mapConfig: MapConfig;
  updateMapConfig: (config: Partial<MapConfig>) => void;
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  scheduledDate: string;
  type: string;
  description: string;
  estimatedDuration: number; // in minutes
  technicianAssigned?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface ExtensionRequest {
  id: string;
  vehicleId: string;
  requestDate: string;
  extensionReason: string;
  extensionDays: number;
  status: 'pending' | 'approved' | 'denied';
  approvedBy?: string;
  notes?: string;
}
