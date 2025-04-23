
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  mileage: number;
  lastCheckDate?: string;
  clientId: string;
  services: string[];
  repairs: string[];
  status: 'available' | 'maintenance';
}
