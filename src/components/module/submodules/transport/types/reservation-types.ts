
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
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  estimatedDropoffTime: string;
  actualDropoffTime?: string;
  price: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'cancelled';
  paymentMethod?: string;
  notes?: string | any[];
  createdAt: string;
  updatedAt: string;
  // Add missing properties referenced in ClientHistoryDialog
  date?: string;
  time?: string;
  pickup?: string;
  dropoff?: string;
  service?: string;
}
