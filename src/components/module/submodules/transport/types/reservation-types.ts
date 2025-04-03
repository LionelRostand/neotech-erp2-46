// Create this file if it doesn't exist or update it
export interface TransportReservation {
  id: string;
  clientId: string;
  clientName: string;
  vehicleId: string;
  vehicleName?: string;
  driverId?: string;
  driverName?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  date: string;
  time?: string;
  pickup: string | { address: string; datetime: string };
  dropoff: string | { address: string; datetime: string };
  service?: string;
  amount: number;
  price?: number; // Add this field to fix price errors
  paymentStatus: 'pending' | 'paid' | 'failed' | 'partial' | 'unpaid';
  isPaid?: boolean;
  needsDriver?: boolean;
  contractGenerated?: boolean;
  notes?: string[];
  requestId?: string; // Adding requestId field
}

export interface Reservation {
  id: string;
  clientId: string;
  clientName: string; // Add clientName
  vehicleId: string;
  driverId?: string;
  startDate: string;
  endDate: string;
  status: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: number;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'partial' | 'unpaid';
  createdAt: string;
  updatedAt?: string;
  notes?: string[];
}

// Helper function to extract address from different formats
export const getAddressString = (location: string | { address: string; datetime?: string }): string => {
  if (typeof location === 'string') {
    return location;
  }
  
  if (location && typeof location === 'object' && 'address' in location) {
    return location.address;
  }
  
  return "Address not available";
};

// Add export for TransportReservationStatus
export type TransportReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'in-progress';
