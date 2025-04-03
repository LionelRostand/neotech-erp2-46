
export interface Coordinates {
  lat: number;
  lng: number;
  // For backward compatibility
  latitude?: number;
  longitude?: number;
}

export interface VehicleLocation {
  vehicleId: string;
  coordinates: Coordinates;
  timestamp: string;
}

export interface TransportVehicleLocation extends VehicleLocation {
  status: string;
  heading: number;
  speed: number;
}

export interface MapBounds {
  northEast: Coordinates;
  southWest: Coordinates;
}

export interface MapViewSettings {
  center: Coordinates;
  zoom: number;
}
