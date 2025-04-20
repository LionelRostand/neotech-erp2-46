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

export interface Location {
  id: string;
  name: string;
  address: string;
  phone?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Reservation {
  id: string;
  clientId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  pickupLocation?: string;
  dropoffLocation?: string;
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
