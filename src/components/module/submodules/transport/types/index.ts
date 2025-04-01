
// Re-export all types from the separate type modules

// Re-export specific types from base-types
export * from './base-types';

// Re-export vehicle types
export * from './vehicle-types';

// Re-export driver types
export * from './driver-types';

// Re-export map types explicitly to avoid ambiguity
export { 
  Coordinates, 
  VehicleLocation, 
  TransportVehicleWithLocation,
  MapConfig,
  MapMarker,
  MapHookResult,
  MapExtensionRequest
} from './map-types';

// Re-export with aliases to avoid ambiguity
export { MapExtensionRequest as ExtensionRequestType } from './map-types';

// Re-export geolocation types (excluding duplicates)
export * from './geolocation-types';

// Re-export client types explicitly
export type {
  TransportClient,
  ClientNote,
  LoyaltyProgram,
  LoyaltyTier,
  LoyaltyTransaction,
  ClientPreference,
  ClientStatistics,
  WebBookingUser
} from './client-types';

// Re-export client types with aliases
export type { WebBooking as ClientWebBooking } from './client-types';
export type { WebBookingStatus as ClientWebBookingStatus } from './client-types';
export type { WebBookingService as ClientWebBookingService } from './client-types';

// Re-export reservation types
export * from './reservation-types';

// Re-export planning types
export * from './planning-types';

// Re-export integration types 
export * from './integration-types';
