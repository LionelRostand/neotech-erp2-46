
// Create or update driver-types.ts with necessary properties
export interface TransportDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'available' | 'busy' | 'on_leave' | 'off_duty' | 'active' | 'driving' | 'off-duty';
  available: boolean;
  onLeave?: boolean;
  vehicleId?: string;
  notes: DriverNote[];
  schedule?: DriverSchedule[];
  rating?: number;
  experience?: number;
  skills?: string[];
  photo?: string;
  preferredVehicleType?: string[];
  language?: string[];
  licensesTypes?: string[];
  performance?: {
    completedTrips: number;
    rating: number;
    onTimePercentage: number;
    cancelRate: number;
    averageRating?: number; // Add this for backward compatibility
  };
  hireDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DriverNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy?: string;
}

export interface DriverSchedule {
  id?: string;
  startDate: string;
  endDate: string;
  shiftType?: 'morning' | 'evening' | 'night' | 'full-day';
  status?: 'scheduled' | 'completed' | 'canceled';
}

export interface DriverAvailabilityPeriod {
  driverId: string;
  startDate: string;
  endDate: string;
  availabilitySlots: {
    startTime: string;
    endTime: string;
  }[];
}

export interface DriverRatingEntry {
  id: string;
  driverId: string;
  clientId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
