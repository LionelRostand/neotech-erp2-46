
// Export all types from the separate type modules

// Export from base-types.ts
export type { Note, TransportService } from './base-types';

// Export from driver-types.ts 
export type { TransportDriver, DriverNote } from './driver-types';

// Export from vehicle-types.ts
export type { 
  TransportVehicle, 
  VehicleNote, 
  MaintenanceRecord, 
  IncidentRecord,
  MaintenanceSchedule as VehicleMaintenanceSchedule 
} from './vehicle-types';

// Export from map-types.ts
export type { 
  VehicleLocation, 
  TransportVehicleWithLocation, 
  MapConfig, 
  MapHookResult,
  MaintenanceSchedule as MapMaintenanceSchedule,
  ExtensionRequest as MapExtensionRequest 
} from './map-types';

// Export from other type files
export type * from './geolocation-types';
export * from './reservation-types';
