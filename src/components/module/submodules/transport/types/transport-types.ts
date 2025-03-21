
export interface TransportVehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  licensePlate: string;
  available: boolean;
  status: "active" | "maintenance" | "out-of-service";
  color?: string;
  fuelType?: string;
  mileage?: number;
  purchaseDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  insuranceExpiryDate?: string;
  notes?: string;
}

export interface TransportDriver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  available: boolean;
  onLeave?: boolean;
  rating: number;
  experience: number;
  photo: string;
  skills?: string[];
  preferredVehicleTypes?: string[];
  notes?: string;
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  type: "regular" | "repair" | "inspection";
  description: string;
  completed: boolean;
  technician: string;
  notes?: string;
}

export interface ExtensionRequest {
  id: string;
  reservationId: string;
  clientName: string;
  originalEndDate: string;
  requestedEndDate: string;
  vehicleName: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
}

export interface Reservation {
  id: string;
  vehicleId: string;
  driverId?: string;
  clientId: string;
  clientName: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  paymentStatus: "pending" | "partial" | "paid";
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: "regular" | "repair" | "inspection";
  date: string;
  description: string;
  cost: number;
  provider: string;
  nextMaintenance: string;
  resolved: boolean;
}

export interface IncidentRecord {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  severity: "minor" | "moderate" | "major";
  driverName: string;
  clientName: string;
  damageDetails: string;
  repairCost: number;
  insuranceClaim: boolean;
  resolved: boolean;
}

export interface DriverNote {
  id: string;
  driverId: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface VehicleNote {
  id: string;
  vehicleId: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
}
