
// reservation-types.ts

export interface Address {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  address?: string; // Full formatted address
  lat?: number;
  lng?: number;
}

export interface Reservation {
  id: string;
  startDate?: string;
  endDate?: string;
  pickupLocation: Address;
  dropoffLocation: Address;
  status: string;
  paymentStatus?: string;
  clientId?: string;
  clientName?: string;
  totalAmount?: number;
  notes?: string | Array<{content: string}> | any[];
  createdAt?: string;
  updatedAt?: string;
  pickup?: string; // Short form pickup address
  dropoff?: string; // Short form dropoff address
  client?: string; // Client name for backward compatibility
  date?: string; // For calendar use
  vehicle?: string;
  driver?: string;
}

export type TransportReservationStatus = 
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export type PaymentStatus = 
  | 'unpaid'
  | 'partial'
  | 'paid'
  | 'refunded';

export interface TransportReservation {
  id: string;
  clientId?: string;
  clientName?: string;
  vehicleId?: string;
  driverId?: string;
  service?: any;
  date?: string;
  time?: string;
  pickup?: string;
  dropoff?: string;
  pickupLocation?: Address;
  dropoffLocation?: Address;
  status?: TransportReservationStatus;
  paymentStatus?: PaymentStatus;
  price?: number;
  isPaid?: boolean;
  notes?: string | Array<{content: string}> | any[];
  createdAt?: string;
  updatedAt?: string;
  needsDriver?: boolean;
  contractGenerated?: boolean;
}

export interface ReservationFilter {
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  status?: TransportReservationStatus[];
  vehicleTypes?: string[];
  clients?: string[];
  drivers?: string[];
}

// Helper function to get a formatted address string from an Address object
export function getAddressString(address: Address | undefined): string {
  if (!address) {
    return 'Non spécifié';
  }
  
  if (address.address) {
    return address.address;
  }
  
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.postalCode) parts.push(address.postalCode);
  if (address.country) parts.push(address.country);
  
  return parts.length > 0 ? parts.join(', ') : 'Non spécifié';
}
