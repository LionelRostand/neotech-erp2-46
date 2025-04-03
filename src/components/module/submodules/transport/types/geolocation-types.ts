
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

// Defining the full MapExtensionRequest interface
export interface MapExtensionRequest {
  id: string;
  extended: boolean;
  fullscreen: boolean;
  status: 'pending' | 'approved' | 'rejected';
  clientName: string;
  vehicleName: string;
  driverName?: string;
  reason: string;
  originalEndTime: string;
  newEndTime: string;
  originalEndDate: string;
  requestedEndDate: string;
  extensionReason?: string;
}

export interface MapViewSettings {
  zoom: number;
  center: Coordinates;
  showTraffic: boolean;
  showSatellite: boolean;
}
