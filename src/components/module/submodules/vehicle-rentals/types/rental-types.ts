
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
