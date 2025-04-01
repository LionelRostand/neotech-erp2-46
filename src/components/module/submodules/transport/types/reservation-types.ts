
// Define types related to reservations and booking for the Transport module

export interface LocationType {
  address: string;
  latitude?: number;
  longitude?: number;
  name?: string;
  placeId?: string;
}

export interface WebBookingService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  available: boolean;
  serviceType?: string; // Added serviceType property
}

export interface WebBooking {
  id: string;
  serviceId: string;
  clientId: string;
  bookingDate: string;
  pickupLocation: LocationType;
  dropoffLocation: LocationType;
  status: 'pending' | 'confirmed' | 'cancelled' | 'new'; // Added 'new' status
  notes?: string;
  clientName?: string; // Added properties used in components
  date?: string;
  time?: string;
}

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
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  pickup?: LocationType;  // Added for compatibility
  dropoff?: LocationType;  // Added for compatibility
}

export interface TransportReservation {
  id: string;
  clientId: string;
  vehicleId: string;
  driverId: string;
  startLocation: LocationType | string; // Allow string type for compatibility
  endLocation: LocationType | string; // Allow string type for compatibility
  startTime: string;
  endTime: string;
  status: TransportReservationStatus;
  price: number;
  notes?: string;
  // Added missing properties used in components
  service?: string | { name: string };
  date?: string;
  time?: string;
  pickup?: string | LocationType;
  dropoff?: string | LocationType;
  isPaid?: boolean;
  contractGenerated?: boolean;
  needsDriver?: boolean;
  createdAt?: string;
}

export type TransportReservationStatus = 
  | 'pending'
  | 'confirmed'
  | 'inProgress'
  | 'completed'
  | 'cancelled';

// Add this utility function to safely get the address string
export function getAddressString(location: LocationType | string): string {
  if (typeof location === 'string') {
    return location;
  }
  return location?.address || '';
}
