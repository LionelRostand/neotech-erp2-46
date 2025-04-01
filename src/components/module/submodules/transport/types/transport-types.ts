
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

// Export from other modules without duplications
export * from './geolocation-types';

// Export client types directly
export type * from './client-types';

// Export reservation types
export type * from './reservation-types';

// Export planning types
export type * from './planning-types';

// Export integration types
export type * from './integration-types';
