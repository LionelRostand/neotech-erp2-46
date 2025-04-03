
// Define types for transport reservations
export interface PickupLocation {
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface TransportReservationStatus {
  confirmed: 'confirmed';
  pending: 'pending'; 
  completed: 'completed';
  cancelled: 'cancelled';
}

export interface TransportReservation {
  id: string;
  clientId: string;
  vehicleId: string;
  driverId?: string;
  status: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  pickup?: string | { address: string };
  dropoff?: string | { address: string };
  service?: string | { name: string };
  paymentStatus?: string;
  date?: string;
  time?: string;
  isPaid?: boolean;
  contractGenerated?: boolean;
  notes?: string | any[] | null;
  pickupLocation?: any;
  dropoffLocation?: any;
  pickupTime?: string;
  estimatedDropoffTime?: string;
  needsDriver?: boolean;
}

// Interface for compatibility with existing components
export interface Reservation {
  id: string;
  clientName?: string;
  vehicleId?: string;
  driverId?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  pickupLocation: any;
  dropoffLocation: any;
  totalAmount?: number;
  notes?: string | any[] | null;
  paymentStatus?: string;
  clientId?: string;
}

/**
 * Helper function to extract readable address string from location data
 */
export function getAddressString(location: any): string {
  if (!location) return 'Adresse non spécifiée';
  
  if (typeof location === 'string') {
    return location;
  }
  
  if (typeof location === 'object') {
    if (location.address) {
      return location.address;
    }
    
    // If we have lat/lng coordinates
    if (location.lat && location.lng) {
      return `${location.lat}, ${location.lng}`;
    }
    
    if (location.latitude && location.longitude) {
      return `${location.latitude}, ${location.longitude}`;
    }
  }
  
  return 'Adresse non spécifiée';
}
