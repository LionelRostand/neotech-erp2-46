
// Re-export all types from their respective files
export * from './base-types';
export { TransportVehicle, MaintenanceRecord, IncidentRecord, VehicleNote, MaintenanceSchedule as VehicleMaintenanceSchedule } from './vehicle-types';

// Export driver-types but avoid conflicts with base-types
export { DriverNote } from './driver-types';

// Export reservation-types
export { WebBooking, Reservation, ReservationStatus, TransportReservation, ExtensionRequest as ReservationExtensionRequest, TransportReservationStatus } from './reservation-types';

// Export client-types
export { TransportClient, LoyaltyTier, LoyaltyActivity, ClientNote } from './client-types';

// Export map-types
export { VehicleLocation, TransportVehicleWithLocation, MapConfig, MapHookResult, MaintenanceSchedule as MapMaintenanceSchedule, ExtensionRequest as MapExtensionRequest } from './map-types';
