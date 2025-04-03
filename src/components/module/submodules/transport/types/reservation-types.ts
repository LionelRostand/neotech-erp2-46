
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
  paymentStatus: 'pending' | 'paid' | 'failed';
  isPaid?: boolean;
  needsDriver?: boolean;
  contractGenerated?: boolean;
  notes?: string[];
}

export interface Reservation {
  id: string;
  clientId: string;
  vehicleId: string;
  driverId?: string;
  startDate: string;
  endDate: string;
  status: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
  notes?: string[];
}
