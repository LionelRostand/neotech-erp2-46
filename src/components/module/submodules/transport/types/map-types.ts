
import { TransportVehicle } from './vehicle-types';

export interface VehicleLocation {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  direction: number;
  timestamp: string;
  address?: string;
  status: string;
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
}

export interface MapHookResult {
  vehicles: TransportVehicleWithLocation[];
  selectedVehicle: TransportVehicleWithLocation | null;
  setSelectedVehicle: (vehicle: TransportVehicleWithLocation | null) => void;
  loading: boolean;
  error: string | null;
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
}
