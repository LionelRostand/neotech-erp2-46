
import { Note, TransportBasic } from './base-types';

export interface TransportDriver extends TransportBasic {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  status: 'active' | 'inactive' | 'vacation' | 'sick' | 'driving' | 'off-duty' | 'on-leave';
  rating: number;
  address?: string;
  photo?: string;
  available?: boolean;
  onLeave?: boolean;
  hireDate: string;
  experience?: number;
  preferredVehicleTypes?: string[];
  skills?: string[];
  performance?: {
    completedTrips: number;
    customerRating: number;
    onTimePercentage: number;
    safetyScore: number;
  };
}

export interface DriverNote extends Note {
  driverId: string;
}
