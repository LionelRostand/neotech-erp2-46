
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  type: VehicleType;
  status: VehicleStatus;
  dailyRate: number;
  mileage: number;
  image?: string;
  features: string[];
  locationId: string;
  nextMaintenanceDate?: string;
  lastMaintenanceDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type VehicleType = 'sedan' | 'suv' | 'hatchback' | 'van' | 'truck' | 'luxury' | 'convertible' | 'electric';
export type VehicleStatus = 'available' | 'rented' | 'maintenance' | 'reserved' | 'inactive';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  drivingLicenseNumber: string;
  drivingLicenseExpiry: string;
  idNumber: string;
  birthDate: string;
  nationality: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  vehicleId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  pickupLocationId: string;
  returnLocationId: string;
  totalPrice: number;
  depositAmount: number;
  depositPaid: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReservationStatus = 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'pending';

export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  reservationId: string;
  clientId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  items: InvoiceItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'partially-paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: MaintenanceType;
  date: string;
  mileage: number;
  description: string;
  cost: number;
  performedBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MaintenanceType = 'oil-change' | 'tire-replacement' | 'inspection' | 'repair' | 'cleaning' | 'other';

export interface RentalStats {
  totalVehicles: number;
  availableVehicles: number;
  rentedVehicles: number;
  inMaintenanceVehicles: number;
  reservedVehicles: number;
  inactiveVehicles: number;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  revenueChange: number;
  occupancyRate: number;
  upcomingMaintenances: number;
  overdueInvoices: number;
  pendingReservations: number;
}
