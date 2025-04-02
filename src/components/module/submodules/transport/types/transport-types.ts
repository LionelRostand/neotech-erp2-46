
// Re-export all types from the separate type modules

// Re-export specific types to avoid ambiguity
export type {
  // From base-types.ts
  Note,
  TransportService,
  TransportBasic
} from './base-types';

export type {
  // From driver-types.ts
  TransportDriver,
  DriverNote,
  DriverSchedule,
  DriverAvailabilityPeriod,
  DriverRatingEntry
} from './driver-types';

export type {
  // From vehicle-types.ts
  TransportVehicle,
  VehicleNote,
  MaintenanceRecord,
  IncidentRecord,
  MaintenanceSchedule
} from './vehicle-types';

export type {
  // From map-types.ts
  VehicleLocation,
  Coordinates,
  TransportVehicleWithLocation,
  MapConfig,
  MapHookResult,
  MapMarker
} from './map-types';

// Use named imports to avoid duplicate exports
import { MapExtensionRequest } from './map-types';
export type { MapExtensionRequest };

// Export from other modules without duplications
export * from './geolocation-types';

// Export client types explicitly
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

// Export reservation types and helpers
export type { 
  TransportReservation, 
  Reservation,
  Address,
  TransportReservationStatus,
  PaymentStatus,
  ReservationFilter
} from './reservation-types';
export { getAddressString } from './reservation-types';

// Export planning types
export * from './planning-types';

// Export integration types
export * from './integration-types';
