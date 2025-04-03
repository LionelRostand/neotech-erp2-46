
// driver-types.ts
export interface TransportDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'active' | 'inactive' | 'on-trip' | 'on-break' | 'driving' | 'off-duty' | 'on_leave';
  rating?: number;
  notes: any[];
  address: string;
  hireDate: string;
  assignedVehicleId?: string;
  experience?: number;
  available?: boolean;
  onLeave?: boolean;
  skills?: string[];
  photo?: string;
  preferredVehicleType?: string[];
  language: string[];
  licensesTypes: string[];
  performance?: {
    completedTrips: number;
    averageRating: number;
    onTimePercentage: number;
  };
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
