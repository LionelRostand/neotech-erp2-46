
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
  heading: number;
  speed: number;
}

export interface TransportVehicleLocation {
  vehicleId: string;
  coordinates: Coordinates;
  timestamp: string;
  status: string;
  heading: number;
  speed: number;
}
