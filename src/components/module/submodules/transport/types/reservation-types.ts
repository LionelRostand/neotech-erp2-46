
// reservation-types.ts

export interface TransportReservation {
  id: string;
  clientId: string;
  clientName?: string;
  vehicleId: string;
  vehicleName?: string;
  driverId: string;
  driverName?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  pickupAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  dropoffAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  pickupTime: string;
  dropoffTime: string;
  date: string;
  distance: number;
  price: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'partial' | 'unpaid';
  notes?: string | Array<{content: string}>;
  createdAt: string;
  updatedAt: string;
  
  // Additional fields needed by components
  pickup?: {
    address: string;
    datetime: string;
  } | string;
  dropoff?: {
    address: string;
    datetime: string;
  } | string;
  service?: string | { name: string };
  time?: string;
  startDate?: string;
  endDate?: string;
  totalAmount?: number;
  isPaid?: boolean;
  needsDriver?: boolean;
  contractGenerated?: boolean;
}

export interface Reservation extends TransportReservation {
  pickup?: {
    address: string;
    datetime: string;
  } | string;
  dropoff?: {
    address: string;
    datetime: string;
  } | string;
  client?: string;
  vehicle?: string;
  driver?: string;
  pickupLocation?: { address: string };
  dropoffLocation?: { address: string };
  startDate?: string;
  endDate?: string;
  totalAmount?: number;
}

// Helper function to format addresses
export const getAddressString = (address: any): string => {
  if (typeof address === 'string') return address;
  
  if (address && typeof address === 'object') {
    if ('street' in address) {
      const { street, city, postalCode, country } = address;
      return `${street}, ${city}, ${postalCode}, ${country}`;
    }
    if ('address' in address) {
      return address.address;
    }
  }
  
  return "Adresse non disponible";
};

export interface ReservationNote {
  id: string;
  reservationId: string;
  note: string;
  author: string;
  timestamp: string;
}

// Adding TransportReservationStatus type which is used in ReservationFormDialog
export type TransportReservationStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

// Add utility functions for working with services
export const stringToService = (serviceString: string): string | { name: string } => {
  return { name: serviceString };
};

export const serviceToString = (service: string | { name: string } | undefined): string => {
  if (!service) return 'airport';
  if (typeof service === 'object' && 'name' in service) return service.name;
  return service;
};
