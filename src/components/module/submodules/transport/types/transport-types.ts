
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
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  dropoff: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  status: TransportReservationStatus;
  price: number;
  isPaid: boolean;
  needsDriver: boolean;
  contractGenerated: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type TransportService = 
  | 'airport-transfer'
  | 'city-tour'
  | 'business-travel'
  | 'wedding'
  | 'event'
  | 'hourly-hire'
  | 'long-distance'
  | 'custom';

export type TransportReservationStatus = 
  | 'confirmed'
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export interface TransportClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  vip: boolean;
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransportVehicle {
  id: string;
  name: string;
  type: 'sedan' | 'suv' | 'van' | 'luxury' | 'bus' | 'minibus';
  capacity: number;
  licensePlate: string;
  available: boolean;
  status: 'active' | 'maintenance' | 'out-of-service';
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  maintenanceHistory?: MaintenanceRecord[];
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  purchaseDate?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  mileage?: number;
  incidents?: IncidentRecord[];
  images?: string[];
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'regular' | 'repair' | 'inspection';
  date: string;
  description: string;
  cost: number;
  provider: string;
  nextMaintenance?: string;
  resolved: boolean;
}

export interface IncidentRecord {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major';
  driverName?: string;
  clientName?: string;
  damageDetails?: string;
  repairCost?: number;
  insuranceClaim?: boolean;
  resolved: boolean;
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
  rating: number;
  experience: number; // in years
  photo?: string;
  status: 'active' | 'on-leave' | 'inactive';
  assignedReservations?: string[];
  preferredVehicleTypes?: string[];
  skills?: string[];
  performance?: {
    onTimeRate: number;
    customerSatisfaction: number;
    safetyScore: number;
  };
}

export interface CustomerServiceTicket {
  id: string;
  clientId: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  relatedReservationId?: string;
  channel: 'email' | 'phone' | 'chat' | 'in-person';
  interactions: TicketInteraction[];
  resolution?: string;
}

export interface TicketInteraction {
  id: string;
  ticketId: string;
  staffId?: string;
  clientId?: string;
  timestamp: string;
  message: string;
  attachments?: string[];
  channel: 'email' | 'phone' | 'chat' | 'in-person';
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsPerEuro: number;
  tiers: LoyaltyTier[];
  rewards: LoyaltyReward[];
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minimumPoints: number;
  benefits: string[];
  pointsMultiplier: number;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  discountPercentage?: number;
  freeService?: boolean;
  validUntil?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_transfer' | 'paypal' | 'cash' | 'other';
  name: string;
  lastDigits?: string;
  expiryDate?: string;
  default: boolean;
}

export interface Payment {
  id: string;
  reservationId: string;
  clientId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: string;
  reference?: string;
  date: string;
  invoice?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  reservationId: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  createdAt: string;
  dueDate: string;
  amount: number;
  tax: number;
  total: number;
  payments: Payment[];
  notes?: string;
}

export interface TransportSettings {
  general: {
    companyName: string;
    logo?: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    currency: string;
    language: string;
    timeZone: string;
  };
  reservations: {
    minimumNotice: number; // in hours
    cancellationPolicy: string;
    defaultPickupTime: string;
    requireClientPhone: boolean;
    requireClientEmail: boolean;
    automaticConfirmation: boolean;
  };
  pricing: {
    basePrices: Record<TransportService, number>;
    hourlyRates: Record<string, number>; // vehicle type -> rate
    distanceRates: Record<string, number>; // vehicle type -> rate per km
    driverFee: number;
    minimumFare: number;
    vatRate: number;
    specialRates: {
      weekendSurcharge: number;
      nightSurcharge: number;
      holidaySurcharge: number;
    };
  };
  loyalty: {
    enabled: boolean;
    programName: string;
    pointsPerEuro: number;
    minimumPointsRedemption: number;
    pointsValueInEuros: number;
  };
  users: {
    roles: UserRole[];
  };
  integrations: {
    accounting: boolean;
    crm: boolean;
    calendar: boolean;
    maps: boolean;
    paymentGateways: string[];
  };
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  type: 'regular' | 'repair' | 'inspection';
  description: string;
  completed: boolean;
  technician?: string;
  notes?: string;
}

export interface VehicleAvailability {
  vehicleId: string;
  date: string;
  isAvailable: boolean;
  reservationId?: string;
  maintenanceId?: string;
}

export interface LocationUpdate {
  vehicleId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  address?: string;
}

export interface GeolocationAlert {
  id: string;
  vehicleId: string;
  type: 'unauthorized_movement' | 'speed_limit' | 'geofence_breach' | 'idle_time';
  timestamp: string;
  latitude: number;
  longitude: number;
  message: string;
  resolved: boolean;
  notes?: string;
}

export interface WebBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: TransportService;
  date: string;
  time: string;
  pickupAddress: string;
  dropoffAddress: string;
  passengers: number;
  luggage: number;
  vehiclePreference?: string;
  specialRequests?: string;
  status: 'new' | 'confirmed' | 'cancelled';
  createdAt: string;
  convertedToReservation: boolean;
  reservationId?: string;
}
