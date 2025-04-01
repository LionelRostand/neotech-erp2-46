
import { TransportBasic, Note } from './base-types';

export interface TransportDriver extends TransportBasic {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseType?: string;
  licenseExpiry: string;
  address?: string;
  available: boolean;
  onLeave: boolean;
  rating: number;
  experience: number; // in years
  language: string[];
  preferredVehicleType: string[];
  hireDate?: string;
  status: 'active' | 'inactive' | 'driving' | 'on_leave' | 'off-duty';
  notes: DriverNote[];
  photo?: string;
  skills?: string[];
  performance?: {
    completedTrips: number;
    averageRating: number;
    onTimePercentage: number;
  };
  specializations?: string[];
}

export interface DriverNote extends Note {
  driverId: string;
}

export interface DriverSchedule {
  id: string;
  driverId: string;
  date: string;
  startTime: string;
  endTime: string;
  reservationId?: string;
  type: 'reservation' | 'break' | 'off-duty' | 'holiday';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DriverAvailabilityPeriod {
  id: string;
  driverId: string;
  startDate: string;
  endDate: string;
  type: 'available' | 'unavailable' | 'vacation' | 'sick-leave';
  reason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DriverRatingEntry {
  id: string;
  driverId: string;
  reservationId: string;
  clientId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
