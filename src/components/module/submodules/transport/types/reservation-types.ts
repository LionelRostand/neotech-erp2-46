
export function getAddressString(location: { address: string } | string): string {
  if (typeof location === 'string') {
    return location;
  }
  return location.address || 'Adresse non spécifiée';
}

export interface WebBookingService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  serviceType: string;
  active: boolean;
}

export interface WebBooking {
  id: string;
  service?: WebBookingService | string;
  serviceId?: string; // Add for backward compatibility
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  pickupLocation?: string | LocationType; // Added for compatibility
  dropoffLocation?: string | LocationType; // Added for compatibility
  passengerCount: number;
  luggageCount: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'new'; // Added 'new' status
  paymentMethod?: string;
  paymentStatus?: string;
  price?: number;
  createdAt?: string;
}

export interface LocationType {
  address: string;
  [key: string]: any;
}

export interface Reservation {
  id: string;
  vehicleId: string;
  driverId?: string;
  clientId: string;
  clientName: string;
  startDate?: string; // For compatibility with mock data
  endDate?: string; // For compatibility with mock data
  pickupLocation: LocationType | string;
  dropoffLocation: LocationType | string;
  pickup?: string | LocationType; // Added for compatibility
  dropoff?: string | LocationType; // Added for compatibility
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'in-progress' | 'no-show';
  paymentStatus?: 'paid' | 'pending' | 'partial' | 'refunded';
  totalAmount?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  // Add required properties from type errors
  passengerCount?: number;
  price?: number;
  type?: string;
  duration?: number;
}

export type TransportReservationStatus = 
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export interface TransportReservation {
  id: string;
  clientId: string;
  vehicleId?: string;
  driverId?: string;
  status: TransportReservationStatus;
  createdAt?: string;
  updatedAt?: string;
  // Add properties referenced by components
  service?: string | { name: string };
  date?: string;
  time?: string;
  pickup?: string | LocationType;
  dropoff?: string | LocationType;
  isPaid?: boolean;
  needsDriver?: boolean;
  contractGenerated?: boolean;
  price?: number; // Add missing property
  notes?: string; // Add missing property
}
