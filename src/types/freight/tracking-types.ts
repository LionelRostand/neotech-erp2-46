
export interface TrackingEvent {
  id: string;
  shipmentId?: string;
  containerId?: string;
  packageId?: string;
  eventType: string;
  location: string;
  timestamp: string;
  description: string;
  latitude?: number;
  longitude?: number;
  performedBy?: string;
  notes?: string;
}

export interface TrackingPoint {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  name: string;
  description?: string;
  status?: string;
}

export interface TrackingInfo {
  reference: string;
  type: 'shipment' | 'container' | 'package';
  status: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  events: TrackingEvent[];
  currentLocation?: string;
  currentCoordinates?: {
    latitude: number;
    longitude: number;
  };
}
