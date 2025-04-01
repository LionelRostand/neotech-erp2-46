
// Define driver-related types for the Transport module

export interface TransportDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'active' | 'inactive' | 'on_leave';
  rating: number;
  hireDate: string;
  profileImage?: string;
  address?: string;
}

export interface DriverNote {
  id: string;
  driverId: string;
  content: string;
  createdAt: string;
  createdBy: string;
}
