
// Add reservation-types.ts if it doesn't exist or update it
export interface TransportReservation {
  id: string;
  clientId: string;
  clientName: string;
  driverId?: string;
  driverName?: string;
  vehicleId?: string;
  vehicleName?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  pickupLocation: string | { address: string; lat?: number; lng?: number };
  dropoffLocation: string | { address: string; lat?: number; lng?: number };
  pickupTime: string;
  estimatedDropoffTime: string;
  actualDropoffTime?: string;
  price: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'cancelled';
  paymentMethod?: string;
  notes?: string | any[];
  createdAt: string;
  updatedAt: string;
  
  // Add missing properties referenced in ClientHistoryDialog and other components
  date?: string;
  time?: string;
  pickup?: string | { address: string; lat?: number; lng?: number };
  dropoff?: string | { address: string; lat?: number; lng?: number };
  service?: string;
  
  // Add missing properties for ContractGenerationDialog and ViewReservationDialog
  needsDriver?: boolean;
  isPaid?: boolean;
  contractGenerated?: boolean;
}

// Add the Reservation type used in several components
export interface Reservation {
  id: string;
  client: string;
  clientName: string;
  vehicle?: string;
  driver?: string;
  startDate: string;
  endDate: string;
  pickupLocation: { address: string; lat?: number; lng?: number };
  dropoffLocation: { address: string; lat?: number; lng?: number };
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  totalAmount: number;
  notes?: string | any[];
  updatedAt?: string;
  createdAt?: string;
}

// Add reservation status type
export type TransportReservationStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

// Add helper function for getting string address from location object
export const getAddressString = (location: string | { address: string }): string => {
  if (!location) return "";
  if (typeof location === "string") return location;
  return location.address || "";
};
