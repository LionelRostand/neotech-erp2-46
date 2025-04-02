import { TransportBasic, Note } from './base-types';
import { TransportService } from './base-types';

export interface TransportClient extends Omit<TransportBasic, 'name'> {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  clientType: 'individual' | 'corporate' | 'vip';
  loyaltyProgram?: LoyaltyProgram;
  notes: ClientNote[];
  createdAt: string;
  updatedAt?: string;
  active: boolean;
  preferences?: ClientPreference[];
  statistics?: ClientStatistics;
  webBookings?: WebBooking[];
  name?: string;
  loyaltyPoints?: number;
}

export interface ClientNote extends Note {
  clientId: string;
}

export interface LoyaltyProgram {
  id: string;
  clientId: string;
  tier: LoyaltyTier;
  points: number;
  joinDate: string;
  transactions: LoyaltyTransaction[];
  expiryDate?: string;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minimumPoints: number;
  benefits: string[];
  discountPercentage: number;
  color: string;
  icon?: string;
}

export interface LoyaltyTransaction {
  id: string;
  clientId: string;
  reservationId?: string;
  points: number;
  type: 'earn' | 'redeem' | 'expire' | 'adjust';
  description: string;
  createdAt: string;
}

export interface ClientPreference {
  id: string;
  clientId: string;
  category: string;
  value: string;
  isDefault: boolean;
}

export interface ClientStatistics {
  totalReservations: number;
  completedReservations: number;
  canceledReservations: number;
  totalSpent: number;
  averageRating: number;
  lastReservationDate?: string;
}

export interface WebBookingUser {
  id: string;
  clientId: string;
  email: string;
  passwordHash: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  active: boolean;
  verified: boolean;
  verificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpiry?: string;
}

export interface WebBooking {
  id: string;
  clientId: string;
  service: TransportService;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  passengers: number;
  specialRequirements?: string;
  status: WebBookingStatus;
  createdAt: string;
  updatedAt?: string;
  estimatedPrice?: number;
  reservationId?: string;
  vehicleTypePreference?: string;
}

export type WebBookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'canceled' 
  | 'completed' 
  | 'new' 
  | 'cancelled' 
  | 'processed';

export interface WebBookingService {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  basePrice: number;
  pricePerKm?: number;
  pricePerMinute?: number;
  minimumPrice: number;
  vehicleTypes: string[];
  serviceOptions: {
    id: string;
    name: string;
    price: number;
    description: string;
  }[];
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  leadTimeHours: number;
  maxPassengers: number;
  createdAt: string;
  updatedAt?: string;
}
