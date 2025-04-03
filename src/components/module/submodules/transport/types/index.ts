
// Re-export all types from the individual modules with explicit exports to avoid ambiguity
export * from './base-types';
export * from './client-types';
export * from './geolocation-types';
export * from './planning-types';

// Export driver types from driver-types and transport-types explicitly to avoid ambiguity
export type { TransportDriver } from './driver-types';
export { TransportDriver as TransportDriverBase } from './transport-types';

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
export type { 
  TransportReservation,
  Reservation,
  TransportReservationStatus
} from './reservation-types';
export { getAddressString } from './reservation-types';

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
  TransportVehicleWithLocation
} from './transport-types';
export type { 
  MapExtensionRequest
} from './geolocation-types';

// Export web booking types
export * from './web-booking-types';

// Re-export utility functions
export { stringToService, serviceToString } from '../utils/service-utils';

// Export other transport types
export type { TransportSettings } from './transport-types';
