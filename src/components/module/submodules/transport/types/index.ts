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
  TransportVehicleWithLocation, 
  MapConfig, 
  MapHookResult, 
  ExtensionRequest
} from './map-types';

// Export from client-types.ts
export type { 
  Client, 
  TransportClient, 
  ClientNote, 
  LoyaltyTransaction, 
  LoyaltyReward, 
  ClientFilters 
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
  MapExtensionRequest,
  PlanningFilter,
  PlanningItem
} from './planning-types';

// Export from other type files
export * from './geolocation-types';
export * from './integration-types';
