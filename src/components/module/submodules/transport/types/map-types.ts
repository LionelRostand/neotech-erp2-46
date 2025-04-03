
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface VehicleLocation {
  lat: number;
  lng: number;
  address?: string;
  // Adding fields needed by components
  coordinates?: Coordinates;
  status?: 'moving' | 'idle' | 'stopped';
  heading?: number;
  speed?: number;
  timestamp?: string;
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
  location: VehicleLocation | TransportVehicleLocation;
  notes: any[];
  driverName?: string;
  [key: string]: any;
}

export interface MapExtensionRequest {
  id: string;
  requestId?: string;
  clientName?: string;
  vehicleName?: string;
  vehicleId?: string;
  driverName?: string;
  originalEndDate?: string;
  requestedEndDate?: string;
  originalEndTime?: string;
  newEndTime?: string;
  status?: 'pending' | 'approved' | 'rejected';
  reason?: string;
  extensionReason?: string;
  reservationId?: string;
  timestamp?: string;
  type?: 'traffic' | 'satellite' | 'terrain' | 'heatmap';
  active?: boolean;
  config?: Record<string, any>;
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
