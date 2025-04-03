
// geolocation-types.ts

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface VehicleLocation {
  vehicleId: string;
  coordinates: Coordinates;
  timestamp: string;
  status: string;
  heading?: number;
  speed?: number;
  address?: string;
}

export interface TransportVehicleLocation {
  id: string;
  vehicleId: string;
  driverName?: string;
  coordinates: Coordinates;
  timestamp: string;
  status: string;
  heading?: number;
  speed?: number;
  address?: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapExtensionRequest {
  extended: boolean;
  fullscreen: boolean;
}

export interface MapViewSettings {
  zoom: number;
  center: Coordinates;
  showTraffic: boolean;
  showSatellite: boolean;
}
