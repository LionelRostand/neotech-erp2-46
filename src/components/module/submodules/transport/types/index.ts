
// Re-export specific types from base-types
export * from './base-types';

// Re-export vehicle types
export * from './vehicle-types';

// Re-export driver types
export * from './driver-types';

// Re-export map types explicitly to avoid ambiguity
export type {
  Coordinates, 
  VehicleLocation, 
  TransportVehicleWithLocation,
  MapConfig,
  MapMarker,
  MapHookResult,
  MapExtensionRequest
} from './map-types';

// Re-export with aliases to avoid ambiguity
export type { MapExtensionRequest as ExtensionRequestType } from './map-types';

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
  WebBookingService
} from './client-types';

// Re-export reservation types
export type {
  Reservation,
  TransportReservation,
  ReservationFilter,
  TransportReservationStatus,
  Address,
  PaymentStatus,
  // Explicitly re-export WebBookingStatus from reservation-types
  WebBookingStatus
} from './reservation-types';

// Re-export planning types
export * from './planning-types';

// Re-export integration types 
export * from './integration-types';

// Re-export the getAddressString utility function
export { getAddressString } from './reservation-types';
