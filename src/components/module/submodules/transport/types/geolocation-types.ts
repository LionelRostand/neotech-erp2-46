
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface VehicleLocation {
  vehicleId: string;
  location: Coordinates;
  heading?: number;
  speed?: number;
  updatedAt?: string;
}

export interface TransportVehicleLocation {
  vehicleId: string;
  location: Coordinates;
  timestamp: string;
  speed?: number;
  heading?: number;
  status?: 'moving' | 'stopped' | 'parked' | 'offline';
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapViewSettings {
  center: Coordinates;
  zoom: number;
  bounds?: MapBounds;
}
