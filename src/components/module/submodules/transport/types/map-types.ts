
// map-types.ts
export interface Coordinates {
  latitude: number;
  longitude: number;
  // Additional properties used in components
  vehicleId?: string;
  status?: string;
  heading?: number;
  speed?: number;
  timestamp?: string;
}

export interface VehicleLocation {
  vehicleId: string;
  coordinates: Coordinates;
  timestamp: string;
  status: string;
  heading: number;
  speed: number;
}

export interface TransportVehicleWithLocation {
  id: string;
  name: string;
  type: string;
  licensePlate: string;
  status: string;
  available: boolean;
  capacity?: number;
  driverName?: string;
  location: VehicleLocation;
  notes: any[];
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  markers: any[];
  selectedVehicleId?: string;
}

export interface MapHookResult {
  map: any;
  markers: any[];
  isLoaded: boolean;
  selectedVehicle: TransportVehicleWithLocation | null;
  selectVehicle: (vehicleId: string) => void;
}

export interface MapExtensionRequest {
  vehicleId: string;
  type: 'route' | 'alert' | 'history';
  startDate?: string;
  endDate?: string;
  parameters?: Record<string, any>;
}

export type MapMarker = {
  id: string;
  position: [number, number];
  icon?: any;
  popup?: string;
};
