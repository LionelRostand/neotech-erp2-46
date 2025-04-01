
// Types related to reservations and bookings

export interface TransportReservation {
  id: string;
  clientId: string;
  driverId?: string;
  vehicleId?: string;
  serviceType: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
  pickupDate: string;
  status: TransportReservationStatus;
  price: number;
  passengers: number;
  distance?: number;
  duration?: number;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  driverTip?: number;
  luggage?: number;
}

export type TransportReservationStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface LocationType {
  street: string;
  number?: string;
  city: string;
  postalCode: string;
  country: string;
  additionalInfo?: string;
}

export interface WebBooking {
  id: string;
  serviceType: string;
  date: string;
  time: string;
  pickupAddress: string;
  dropoffAddress?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  passengers: number;
  notes?: string;
  status: 'new' | 'processed' | 'cancelled';
  createdAt: string;
  price?: number;
}

export interface WebBookingService {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  active: boolean;
}

export interface Reservation {
  id: string;
  type: string;
  client: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  pickup: {
    address: string;
    date: string;
    time: string;
  };
  dropoff?: {
    address: string;
  };
  vehicle?: {
    id: string;
    name: string;
    type: string;
  };
  driver?: {
    id: string;
    name: string;
    phone: string;
  };
  status: string;
  price: number;
  paymentStatus: string;
  paymentMethod?: string;
}

// Helper function to format addresses
export function getAddressString(location: LocationType): string {
  return `${location.number ? location.number + ' ' : ''}${location.street}, ${location.postalCode} ${location.city}, ${location.country}`;
}
