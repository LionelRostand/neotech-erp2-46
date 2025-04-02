
// driver-types.ts
export interface TransportDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  available: boolean;
  onLeave: boolean;
  experience: number;
  licensesTypes: string[];
  status: 'active' | 'inactive' | 'on_leave';
  rating: number;
  skills?: string[];
  photo?: string;
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
  startTime: string;
  endTime: string;
  type: string;
  description?: string;
}

export interface DriverAvailabilityPeriod {
  id: string;
  driverId: string;
  startDate: string;
  endDate: string;
  reason?: string;
  type: 'available' | 'unavailable' | 'vacation' | 'sick_leave' | 'training';
}

export interface DriverRatingEntry {
  id: string;
  driverId: string;
  rating: number;
  feedback?: string;
  clientId?: string;
  clientName?: string;
  date: string;
}
