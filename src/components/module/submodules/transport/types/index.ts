
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

// Re-export client types explicitly using type keyword
export type {
  TransportClient,
  ClientNote,
  LoyaltyProgram,
  LoyaltyTier,
  LoyaltyTransaction,
  ClientPreference,
  ClientStatistics,
  WebBookingUser,
  WebBooking,
  WebBookingStatus,
  WebBookingService
} from './client-types';

// Re-export reservation types
export * from './reservation-types';

// Re-export planning types
export * from './planning-types';

// Re-export integration types 
export * from './integration-types';
