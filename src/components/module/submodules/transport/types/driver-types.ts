
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
  preferredVehicleType?: string; // For backward compatibility
  skills?: string[];
  performance?: {
    completedTrips: number;
    customerRating: number;
    onTimePercentage: number;
    safetyScore: number;
    onTimeRate?: number; // For backward compatibility
    customerSatisfaction?: number; // For backward compatibility
  };
}

export interface DriverNote extends Note {
  driverId: string;
}
