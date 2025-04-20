
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  status: 'available' | 'rented' | 'maintenance';
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  vehicleId: string;
  reservationId: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  notes?: string;
}

