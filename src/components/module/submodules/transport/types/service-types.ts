
// service-types.ts
export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface ServiceAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

// Additional service-related types used throughout the application
export interface ServicePricing {
  basePrice: number;
  pricePerKm?: number;
  pricePerMinute?: number;
  minimumPrice?: number;
}
