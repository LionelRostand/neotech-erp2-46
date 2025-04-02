
// Export bare minimum to make sure getAddressString is exported
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  additionalInfo?: string;
}

export interface TransportReservation {
  // Complete structure to make TypeScript happy
  id: string;
  status?: string;
  price?: number;
  date?: string;
  time?: string;
  pickup?: string | { address: string };
  dropoff?: string | { address: string };
  service?: any;
  clientId?: string;
  vehicleId?: string;
  driverId?: string;
  isPaid?: boolean;
  needsDriver?: boolean;
  contractGenerated?: boolean;
  notes?: string;
  createdAt?: string;
}

export interface Reservation {
  // Complete structure to make TypeScript happy
  id: string;
  client?: string;
  clientName?: string;
  vehicle?: string;
  driver?: string;
  startDate?: string;
  endDate?: string;
  pickupLocation?: any;
  dropoffLocation?: any;
  totalAmount?: number;
  status?: string;
  paymentStatus?: string;
  notes?: string;
}

export type TransportReservationStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';

export interface ReservationFilter {
  startDate?: string;
  endDate?: string;
  status?: TransportReservationStatus;
  vehicleId?: string;
  driverId?: string;
  clientId?: string;
}

// This is the missing function that needs to be exported
export function getAddressString(address: Address): string {
  const parts = [
    address.street,
    address.city,
    address.postalCode,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
}
