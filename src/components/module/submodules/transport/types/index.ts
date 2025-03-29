
// Re-export all types from their respective files
export * from './base-types';

// For vehicle-types, import everything and then re-export with specific renames for duplicated types
import * as VehicleTypes from './vehicle-types';
export type {
  TransportVehicle,
  MaintenanceRecord,
  IncidentRecord,
  VehicleNote
} from './vehicle-types';
// Re-export the MaintenanceSchedule with a more specific name
export type { MaintenanceSchedule as VehicleMaintenanceSchedule } from './vehicle-types';

export * from './driver-types';

// For reservation-types, import everything and then re-export with specific renames for duplicated types
import * as ReservationTypes from './reservation-types';
export type {
  TransportReservation,
  Reservation,
  WebBooking
} from './reservation-types';
// Re-export the ExtensionRequest with a more specific name
export type { ExtensionRequest as ReservationExtensionRequest } from './reservation-types';

export * from './client-types';

// For map-types, rename when necessary
import * as MapTypes from './map-types';
export type {
  VehicleLocation,
  TransportVehicleWithLocation,
  MapConfig,
  MapHookResult
} from './map-types';
// Re-export with more specific names to avoid conflicts
export type { MaintenanceSchedule as MapMaintenanceSchedule } from './map-types';
export type { ExtensionRequest as MapExtensionRequest } from './map-types';

// Create a backward compatibility layer to avoid breaking imports
// This way code that imports from transport-types.ts will still work
