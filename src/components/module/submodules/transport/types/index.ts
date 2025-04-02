
// Export all types from the submodules
export * from './driver-types';
export * from './vehicle-types';
export * from './reservation-types';
export * from './client-types';
export * from './map-types';
export * from './service-types';
export * from './web-booking-types';

// Fix for the MapExtensionRequest issues
export type { MapExtensionRequest } from './map-types';

// Export TransportVehicleWithLocation specifically
export type { TransportVehicleWithLocation } from './map-types';

// Export web booking related types
export type { WebBookingConfig, MenuItem, BannerConfig } from './web-booking-types';
