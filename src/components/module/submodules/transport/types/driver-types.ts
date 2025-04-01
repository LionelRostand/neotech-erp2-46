
// Define driver-related types for the Transport module

export interface TransportDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseType?: string;
  licenseExpiry: string;
  status: 'active' | 'inactive' | 'on_leave' | 'driving' | 'off-duty';
  rating: number;
  hireDate: string;
  profileImage?: string;
  photo?: string;
  address?: string;
  available?: boolean;
  onLeave?: boolean;
  experience?: number;
  skills?: string[];
  preferredVehicleType?: string;
  preferredVehicleTypes?: string[];
  createdAt?: string;
  performance?: {
    completedTrips?: number;
    onTimeRate?: number;
    satisfactionScore?: number;
    cancelledTrips?: number;
    totalDistance?: number;
    avgRating?: number;
    customerSatisfaction?: number;
    safetyScore?: number;
  };
}

export interface DriverNote {
  id: string;
  driverId: string;
  content: string;
  createdAt: string;
  createdBy: string;
}
