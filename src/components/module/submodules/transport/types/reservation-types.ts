
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
  paymentStatus: 'paid' | 'pending' | 'failed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation extends TransportReservation {
  pickup?: {
    address: string;
    datetime: string;
  };
  dropoff?: {
    address: string;
    datetime: string;
  };
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
