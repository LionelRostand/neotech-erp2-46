
export interface LocationType {
  address: string;
  lat?: number;
  lng?: number;
  name?: string;
}

export function getAddressString(location: string | LocationType): string {
  if (typeof location === 'string') {
    return location;
  }
  return location.address || '';
}

export interface WebBookingService {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
}

export interface WebBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
}

export type TransportReservationStatus = 
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | string; // For backward compatibility

export interface Reservation {
  id: string;
  vehicleId: string;
  driverId?: string;
  clientId: string;
  clientName: string;
  startDate: string;
  endDate: string;
  pickupLocation: LocationType;
  dropoffLocation: LocationType;
  status: TransportReservationStatus;
  paymentStatus: 'paid' | 'partial' | 'pending' | 'cancelled';
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportReservation extends Reservation {
  // Any additional fields specific to transport reservations
}
