
// Export all types from the separate type modules

// Export from base-types.ts
export type { Note, TransportService, TransportBasic } from './base-types';

// Export from driver-types.ts 
export type { TransportDriver, DriverNote } from './driver-types';

// Export from vehicle-types.ts
export type { 
  TransportVehicle, 
  VehicleNote, 
  MaintenanceRecord, 
  IncidentRecord,
  MaintenanceSchedule
} from './vehicle-types';

// Export from map-types.ts
export type { 
  VehicleLocation, 
  Coordinates,
  TransportVehicleWithLocation, 
  MapConfig, 
  MapHookResult, 
  MapExtensionRequest
} from './map-types';

// Export from client-types.ts
export type { 
  TransportClient, 
  Client, 
  ClientAddress,
  ClientNote, 
  LoyaltyTransaction, 
  LoyaltyReward, 
  ClientFilters,
  ClientPreference,
  LoyaltyProgram,
  LoyaltyTier
} from './client-types';

// Export from reservation-types
export {
  getAddressString,
  type WebBookingService,
  type WebBooking,
  type Reservation,
  type LocationType,
  type TransportReservation,
  type TransportReservationStatus
} from './reservation-types';

// Export from planning-types
export type { 
  VehicleMaintenanceSchedule,
  PlanningFilter,
  PlanningItem
} from './planning-types';

// Export from other type files
export * from './geolocation-types';
export * from './integration-types';
export * from './permission-types';
