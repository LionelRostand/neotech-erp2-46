
// Re-export all types from the individual modules
export * from './driver-types';
export * from './vehicle-types';
export * from './reservation-types';
export * from './client-types';
export * from './map-types';
export * from './web-booking-types';
export * from './geolocation-types';
export * from './transport-types';
export * from './planning-types';
export * from './base-types';

// Explicitly re-export service types to avoid ambiguity
export type {
  ServiceOption,
  ServiceAvailability,
  ServicePricing,
  TransportService,
  TransportServiceDetails
} from './service-types';
