
// Re-export all types from the individual modules with explicit exports to avoid ambiguity
export * from './base-types';
export * from './client-types';
export * from './geolocation-types';
export * from './planning-types';

// Export driver types
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

// Export reservation types
export type {
  TransportReservation
} from './reservation-types';

// Export service types
export type {
  ServiceOption,
  ServiceAvailability,
  ServicePricing,
  TransportService,
  TransportServiceDetails
} from './service-types';

// Export map types
export type {
  MapExtensionRequest,
  TransportVehicleWithLocation
} from './map-types';

// Export web booking types
export * from './web-booking-types';

// Re-export utility functions
export { stringToService, serviceToString } from '../utils/service-utils';

// Export other transport types
export type { TransportSettings } from './transport-types';
