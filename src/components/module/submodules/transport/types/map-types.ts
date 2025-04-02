
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface VehicleLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface TransportVehicleLocation {
  vehicleId: string;
  coordinates: Coordinates;
  timestamp: string;
  status: 'moving' | 'idle' | 'stopped';
  heading: number;
  speed: number;
  address?: string;
}

export interface TransportVehicleWithLocation {
  id: string;
  name: string;
  type: string;
  licensePlate: string;
  status: string;
  available: boolean;
  capacity?: number;
  location: TransportVehicleLocation;
  notes: any[];
  [key: string]: any;
}

export interface MapExtensionRequest {
  id: string;
  requestId: string;
  clientName: string;
  vehicleName: string;
  driverName?: string;
  originalEndDate: string;
  requestedEndDate: string;
  originalEndTime: string;
  newEndTime: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  extensionReason?: string;
  reservationId: string;
  vehicleId: string;  // Added for compatibility
}

export interface MapMarker {
  id: string;
  position: Coordinates;
  type: 'vehicle' | 'client' | 'depot' | 'driver' | 'destination';
  title: string;
  details?: {
    status?: string;
    info?: string;
    image?: string;
  };
}

export interface MapRoute {
  id: string;
  path: Coordinates[];
  type: 'active' | 'planned' | 'completed';
  vehicleId?: string;
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  routes?: MapRoute[];
}

export interface MapHookResult {
  map: any;
  markers: any[];
  isLoaded: boolean;
  selectedVehicle: TransportVehicleWithLocation | null;
  selectVehicle: (vehicleId: string) => void;
}

// Function to normalize location data into Coordinates format
export function normalizeCoordinates(location: VehicleLocation | { lat: number; lng: number }): Coordinates {
  return {
    latitude: location.lat,
    longitude: location.lng
  };
}

