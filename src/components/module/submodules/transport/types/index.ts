
// Re-export all types from their respective files using export type
export type { TransportService, Note } from './base-types';
export { TransportDriver } from './base-types';

export type { 
  TransportVehicle, 
  MaintenanceRecord, 
  IncidentRecord, 
  VehicleNote, 
  MaintenanceSchedule as VehicleMaintenanceSchedule 
} from './vehicle-types';

// Export driver-types but avoid conflicts with base-types
export type { DriverNote } from './driver-types';

// Export reservation-types
export type { 
  WebBooking, 
  Reservation, 
  ReservationStatus, 
  TransportReservation, 
  ExtensionRequest as ReservationExtensionRequest, 
  TransportReservationStatus 
} from './reservation-types';
export { getAddressString, getAddressObject } from './reservation-types';

// Export client-types
export type { 
  TransportClient, 
  LoyaltyActivity, 
  ClientNote 
} from './client-types';
export { LoyaltyTier } from './client-types';

// Export map-types
export type { 
  VehicleLocation, 
  TransportVehicleWithLocation, 
  MapConfig, 
  MapHookResult, 
  MaintenanceSchedule as MapMaintenanceSchedule, 
  ExtensionRequest as MapExtensionRequest 
} from './map-types';
