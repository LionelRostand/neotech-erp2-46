
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
  DriverNote
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
  MapExtensionRequest
} from './map-types';

// Re-export with aliases to avoid ambiguity
import type { MapExtensionRequest as MER } from './map-types';
export type { MER as ExtensionRequestType };

// Export from other modules
export * from './geolocation-types';
export * from './client-types';
export * from './reservation-types';
export * from './planning-types';
export * from './integration-types';
