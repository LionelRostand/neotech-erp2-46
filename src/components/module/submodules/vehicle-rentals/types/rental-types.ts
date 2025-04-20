export type VehicleStatus = 'available' | 'rented' | 'maintenance' | 'reserved';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  type: 'sedan' | 'suv' | 'van' | 'luxury' | 'hatchback';
  status: VehicleStatus;
  dailyRate: number;
  mileage: number;
  features: string[];
  locationId: string;
  nextMaintenanceDate: string;
  lastMaintenanceDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  drivingLicenseNumber: string;
  drivingLicenseExpiry: string;
  idNumber?: string;
  birthDate?: string;
  nationality?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  clientId: string;
  clientName: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
