
import { TransportBasic, Note, TransportService } from './base-types';

export interface TransportClient extends TransportBasic {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  company?: string;
  vip: boolean;
  loyaltyPoints: number;
  joinDate: string;
  lastActivity?: string;
  totalBookings: number;
  preferredVehicleType?: string;
  preferredDriver?: string;
  notes: ClientNote[];
  status: 'active' | 'inactive' | 'banned';
  name?: string; // Added to fix errors
}

export interface ClientNote extends Note {
  clientId: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsPerEuro: number;
  minimumPoints: number;
  tiers: LoyaltyTier[];
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minimumPoints: number;
  benefits: string[];
  discount: number; // percentage
  specialOffers: boolean;
  priorityBooking: boolean;
  freeUpgrades: number;
}

export interface LoyaltyTransaction {
  id: string;
  clientId: string;
  points: number;
  type: 'earn' | 'spend' | 'expire' | 'adjust';
  reason: string;
  reservationId?: string;
  createdAt: string;
}

export interface ClientPreference {
  id: string;
  clientId: string;
  preferenceKey: string;
  preferenceValue: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientStatistics {
  totalSpent: number;
  averagePerBooking: number;
  bookingsCount: number;
  cancelledBookings: number;
  mostUsedService: string;
  mostVisitedDestination: string;
  firstBookingDate: string;
  lastBookingDate: string;
}

export interface WebBookingUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  verified: boolean;
  clientId?: string;
  createdAt: string;
}

export interface WebBooking {
  id: string;
  userId: string;
  serviceId: string;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  passengers: number;
  specialRequirements?: string;
  price: number;
  isPaid: boolean;
  status: WebBookingStatus;
  createdAt: string;
  updatedAt: string;
  service: WebBookingService;
}

export interface WebBookingService {
  id: string;
  name: string;
  price?: number;
  description?: string;
}

export type WebBookingStatus = 'new' | 'confirmed' | 'cancelled' | 'processed';
