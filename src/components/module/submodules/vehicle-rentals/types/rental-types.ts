
export interface Location {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: {
    [key: string]: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  clientName: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
