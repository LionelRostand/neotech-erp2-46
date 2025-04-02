
// map-types.ts
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface VehicleLocation {
  vehicleId: string;
  coordinates: Coordinates;
  timestamp: string;
  speed?: number;
  heading?: number;
  status?: string;
}

export interface TransportVehicleWithLocation {
  id: string;
  name: string;
  type: string;
  licensePlate: string;
  location: Coordinates;
  status: string;
  driverId?: string;
}

export interface MapConfig {
  centerCoordinates: Coordinates;
  zoom: number;
  mapType: 'streets' | 'satellite';
  showTraffic: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

export interface MapHookResult {
  vehicles: TransportVehicleWithLocation[];
  selectedVehicle: TransportVehicleWithLocation | null;
  mapConfig: MapConfig;
  isLoading: boolean;
  error: string | null;
  selectVehicle: (id: string) => void;
  updateMapConfig: (config: Partial<MapConfig>) => void;
  refreshData: () => void;
}

export interface MapExtensionRequest {
  id: string;
  reservationId?: string;
  vehicleId: string;
  vehicleName: string;
  driverId?: string;
  driverName?: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  requestedExtension?: number;
  originalEndTime?: string;
  newEndTime?: string;
  timestamp?: string;
  requestId?: string;
  clientName?: string;
  originalEndDate?: string;
  requestedEndDate?: string;
  extensionReason?: string;
  createdAt?: string;
  requestDate?: string;
  requestedAt?: string;
  extraTimeMinutes?: number;
  additionalTime?: number;
  extensionDays?: number;
  responseMessage?: string;
}
