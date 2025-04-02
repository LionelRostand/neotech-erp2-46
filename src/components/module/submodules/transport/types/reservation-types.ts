
// Export bare minimum to make sure getAddressString is exported
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  additionalInfo?: string;
}

export interface TransportReservation {
  // Minimum structure to make TypeScript happy
  id: string;
}

export interface Reservation {
  // Minimum structure to make TypeScript happy
  id: string;
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
