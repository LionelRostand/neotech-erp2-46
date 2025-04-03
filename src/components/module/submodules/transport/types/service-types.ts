
// service-types.ts
export interface ServiceOption {
  id: string;
  name: string;
  description?: string;
  price: number;
  isDefault?: boolean;
}

export interface ServiceAvailability {
  id: string;
  serviceId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface ServicePricing {
  id: string;
  serviceId: string;
  name: string;
  basePrice: number;
  pricePerKm?: number;
  pricePerMin?: number;
  minDistance?: number;
  maxDistance?: number;
  discountPercent?: number;
  isDefault?: boolean;
}

export interface TransportService {
  id: string;
  name: string;
  description: string;
  type: string;
  imageUrl?: string;
  isActive: boolean;
  pricing: ServicePricing;
  availability?: ServiceAvailability[];
  options?: ServiceOption[];
  vehicleTypes?: string[];
  createdAt: string;
  updatedAt: string;
}

// Fix the extension of TransportServiceDetails
export interface TransportServiceDetails {
  id: string;
  name: string;
  description: string;
  type: string;
  imageUrl?: string;
  isActive: boolean;
  pricing: ServicePricing[];
  availability?: ServiceAvailability[];
  options?: ServiceOption[];
  vehicleTypes?: string[];
  createdAt: string;
  updatedAt: string;
}
