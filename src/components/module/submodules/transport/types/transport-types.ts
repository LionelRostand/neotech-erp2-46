
// Re-export all types from the separate type modules

// Re-export specific types to avoid ambiguity
export {
  // From base-types.ts
  type Note,
  type TransportService,
  type TransportBasic
} from './base-types';

export {
  // From driver-types.ts
  type TransportDriver,
  type DriverNote
} from './driver-types';

export {
  // From vehicle-types.ts
  type TransportVehicle,
  type VehicleNote,
  type MaintenanceRecord,
  type IncidentRecord,
  type MaintenanceSchedule
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
import { MapExtensionRequest as MER } from './map-types';
export { MER as ExtensionRequestType };

// Export from other modules
export * from './geolocation-types';
export * from './client-types';
export * from './reservation-types';
export * from './planning-types';
export * from './integration-types';
