
// Basic types for reservations

export interface Location {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type LocationType = string | { address: string };

export const getAddressString = (location: LocationType): string => {
  if (typeof location === 'string') {
    return location;
  }
  return location.address || '';
};

export interface WebBookingService {
  id: string;
  name: string;
  price: number;
  description?: string;
  duration?: number;
  image?: string;
  vehicleType?: string;
}

export interface WebBooking {
  id: string;
  serviceId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  pickupLocation: LocationType;
  dropoffLocation: LocationType;
  status: string;
  specialRequests?: string;
  price: number;
  paymentMethod?: string;
  paymentStatus?: string;
}

export interface Reservation {
  id: string;
  clientId: string;
  clientName: string;
  vehicleId?: string;
  vehicleName?: string;
  driverId?: string;
  driverName?: string;
  pickupDate: string;
  pickupLocation: LocationType;
  dropoffLocation: LocationType;
  status: TransportReservationStatus;
  passengerCount: number;
  price: number;
  type: string;
  duration: number;
  luggageCount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  notes?: string;
}

export interface TransportReservation {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  vehicleId: string;
  vehicleName: string;
  driverId?: string;
  driverName?: string;
  start: string;
  end: string;
  startLocation: LocationType;
  endLocation: LocationType;
  status: TransportReservationStatus;
  price: number;
  passengerCount: number;
  luggageCount?: number;
  type: string;
  notes?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  color?: string;
  borderColor?: string;
}

export type TransportReservationStatus = 
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no-show';
