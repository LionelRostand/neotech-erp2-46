
// Define the TransportService type
export type TransportService = "airport" | "hourly" | "pointToPoint" | "dayTour";

export interface TransportDriver {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phoneNumber: string;
  email: string;
  rating: number;
  status: 'available' | 'busy' | 'offline';
  photo?: string;
}

export interface TransportVehicle {
  id: string;
  type: 'sedan' | 'van' | 'luxury' | 'bus';
  licensePlate: string;
  model: string;
  capacity: number;
  driver: string;
  status: 'available' | 'in-use' | 'maintenance';
}
