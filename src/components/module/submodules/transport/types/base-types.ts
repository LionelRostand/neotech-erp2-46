
// Common base types for transport module

export type TransportService = 'airport-transfer' | 'city-tour' | 'business-travel' | 'wedding' | 'event' | 'hourly-hire' | 'long-distance' | 'custom' | 'airport' | 'hourly' | 'pointToPoint';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface TransportDriver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseType?: string;
  address?: string;
  hireDate?: string;
  preferredVehicleType?: string;
  available: boolean;
  onLeave?: boolean;
  rating: number;
  experience: number;
  photo: string;
  skills?: string[];
  preferredVehicleTypes?: string[];
  notes?: string;
  status: "active" | "on-leave" | "inactive" | "driving" | "off-duty" | "vacation" | "sick";
  performance?: {
    onTimeRate: number;
    customerSatisfaction: number;
    safetyScore: number;
    [key: string]: number;
  };
}
