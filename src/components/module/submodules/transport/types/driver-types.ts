
// driver-types.ts
export interface TransportDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'active' | 'inactive' | 'on_leave' | 'driving' | 'off-duty';
  rating?: number;
  notes: any[];
  address: string;
  hireDate: string;
  assignedVehicleId?: string;
  experience?: number;
  available?: boolean;
  onLeave?: boolean;
  skills?: string[];
  // Add missing properties that were causing errors
  photo?: string;
  preferredVehicleType?: string[];
  performance?: {
    completedTrips: number;
    averageRating: number;
    onTimePercentage: number;
  };
  licenseType?: string;
  language?: string[];
  licensesTypes?: string[];
}

export interface DriverNote {
  id: string;
  driverId: string;
  title: string;
  note: string;
  author: string;
  createdAt: string;
}

export interface DriverSchedule {
  id: string;
  driverId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface DriverAvailabilityPeriod {
  id: string;
  driverId: string;
  startDate: string;
  endDate: string;
  type: 'available' | 'unavailable' | 'leave';
  reason?: string;
}

export interface DriverRatingEntry {
  id: string;
  driverId: string;
  rating: number;
  comment?: string;
  clientId?: string;
  clientName?: string;
  reservationId?: string;
  createdAt: string;
}
