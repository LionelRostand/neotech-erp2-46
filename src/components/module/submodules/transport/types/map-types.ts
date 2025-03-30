
import { TransportVehicle } from "./vehicle-types";

export interface VehicleLocation {
  vehicleId: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  timestamp: string;
  status: 'idle' | 'driving' | 'stopped';
}

export interface TransportVehicleWithLocation extends TransportVehicle {
  location: VehicleLocation;
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  tileProvider: string;
  apiKey?: string;
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
}
