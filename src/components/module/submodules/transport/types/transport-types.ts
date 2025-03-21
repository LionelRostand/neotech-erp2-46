
export interface TransportReservation {
  id: string;
  clientId: string;
  vehicleId: string;
  driverId?: string;
  service: TransportService;
  date: string;
  time: string;
  pickup: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  dropoff: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  status: TransportReservationStatus;
  price: number;
  isPaid: boolean;
  needsDriver: boolean;
  contractGenerated: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type TransportService = 
  | 'airport-transfer'
  | 'city-tour'
  | 'business-travel'
  | 'wedding'
  | 'event'
  | 'hourly-hire'
  | 'long-distance'
  | 'custom';

export type TransportReservationStatus = 
  | 'confirmed'
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export interface TransportClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  vip: boolean;
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransportVehicle {
  id: string;
  name: string;
  type: 'sedan' | 'suv' | 'van' | 'luxury' | 'bus' | 'minibus';
  capacity: number;
  licensePlate: string;
  available: boolean;
  status: 'active' | 'maintenance' | 'out-of-service';
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface TransportDriver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  available: boolean;
  rating: number;
  experience: number; // in years
  photo?: string;
  status: 'active' | 'on-leave' | 'inactive';
}
