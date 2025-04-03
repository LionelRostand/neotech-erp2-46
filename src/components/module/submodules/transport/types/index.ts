
// Re-export all types from the individual modules with explicit exports to avoid ambiguity
export * from './base-types';
export * from './client-types';

// Export geolocation types but exclude MapExtensionRequest to avoid conflict
export type { 
  Coordinates, 
  VehicleLocation, 
  TransportVehicleLocation, 
  MapBounds, 
  MapViewSettings 
} from './geolocation-types';

// Export map types explicitly - avoiding the conflict by renaming
export { MapExtensionRequest } from './map-types';

export * from './planning-types';

// Export driver types from driver-types explicitly
export type { 
  TransportDriver, 
  DriverNote, 
  DriverSchedule,
  DriverAvailabilityPeriod,
  DriverRatingEntry 
} from './driver-types';

// Export vehicle types
export type {
  TransportVehicle,
  VehicleNote,
  MaintenanceRecord,
  IncidentRecord,
  MaintenanceSchedule,
  MaintenanceScheduleWithTechnician
} from './vehicle-types';

// Export reservation types with explicit naming to avoid ambiguity
export * from './reservation-types';

// Export service types
export type {
  ServiceOption,
  ServiceAvailability,
  ServicePricing,
  TransportService,
  TransportServiceDetails
} from './service-types';

// Export transport types, ensuring no duplicate exports
export type {
  TransportVehicleWithLocation,
  TransportSettings
} from './transport-types';

// Export web booking types
export * from './web-booking-types';

// Re-export utility functions
export { stringToService, serviceToString } from '../utils/service-utils';
