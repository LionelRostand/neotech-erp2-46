
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface VehicleLocation {
  lat: number;
  lng: number;
  address?: string;
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

export function normalizeCoordinates(location: VehicleLocation): Coordinates {
  return {
    latitude: location.lat,
    longitude: location.lng
  };
}
