
// Re-export all types from the individual modules with explicit exports to avoid ambiguity
export * from './base-types';
export * from './client-types';
export * from './geolocation-types';
export * from './planning-types';
export * from './map-types';

// Export driver types from driver-types explicitly
export type { TransportDriver } from './driver-types';
export * from './driver-types';

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

// Export map types, ensuring no duplicate exports
export type {
  TransportVehicleWithLocation,
  TransportSettings
} from './transport-types';

// Export web booking types
export * from './web-booking-types';

// Re-export utility functions
export { stringToService, serviceToString } from '../utils/service-utils';
