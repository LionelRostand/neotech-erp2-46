
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
  // Additional properties needed by components
  lastServiceDate?: string;
  nextServiceDate?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
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
  // Additional properties needed by components
  status?: "active" | "on-leave" | "inactive" | "driving" | "off-duty" | "vacation" | "sick";
  performance?: {
    onTimeRate: number;
    customerSatisfaction: number;
    safetyScore: number;
    [key: string]: number;
  };
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

// Additional types needed for Reservations and other components
export interface TransportReservation {
  id: string;
  clientId: string;
  vehicleId: string;
  driverId?: string;
  service: TransportService;
  date: string;
  time: string;
  pickup: {
    address: string;
  };
  dropoff: {
    address: string;
  };
  status: TransportReservationStatus;
  price: number;
  isPaid: boolean;
  needsDriver: boolean;
  contractGenerated?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vip?: boolean;
  loyaltyPoints?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type TransportService = 
  | "airport-transfer" 
  | "city-tour" 
  | "business-travel" 
  | "wedding" 
  | "event" 
  | "hourly-hire" 
  | "long-distance" 
  | "custom";

export type TransportReservationStatus = 
  | "confirmed" 
  | "pending" 
  | "in-progress" 
  | "completed" 
  | "cancelled";
