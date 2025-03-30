
// Types de base pour le transport

export interface TransportBasic {
  id: string;
}

export interface Note {
  id: string;
  content: string;
  createdBy?: string;
  createdAt: string;
}

export interface TransportService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  serviceType: 'airport' | 'hourly' | 'pointToPoint' | 'dayTour' | 'other';
  active: boolean;
  vehicleType?: string;
  image?: string;
  minPassengers?: number;
  maxPassengers?: number;
  availableDays?: string[];
  availableHours?: string[];
  pricePerKm?: number;
  pricePerHour?: number;
  minimumHours?: number;
  includesDriver?: boolean;
  extraOptions?: ServiceExtraOption[];
}

export interface ServiceExtraOption {
  id: string;
  name: string;
  description?: string;
  price: number;
}
