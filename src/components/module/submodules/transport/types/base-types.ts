
// Base types shared across the transport module

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  category?: string;
  tags?: string[];
}

export interface TransportService {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number; // in minutes
  vehicleTypeRequired?: string;
  active: boolean;
  maxPassengers?: number;
  serviceType: 'taxi' | 'shuttle' | 'vip' | 'event' | 'corporate' | 'tour' | 'other' | 'airport' | 'hourly' | 'pointToPoint' | 'dayTour' | string;
}

// Ensure basic types are available for extensions in other files
export interface TransportBasic {
  id: string;
  createdAt: string;
  updatedAt?: string;
}
