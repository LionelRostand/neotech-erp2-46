
// Re-export all types from the separate type modules for easy access
export * from './base-types';
export * from './driver-types';
export * from './vehicle-types';
export * from './map-types';
export * from './client-types';
export * from './reservation-types';
export * from './planning-types';
export * from './geolocation-types';
export * from './integration-types';

// Note: We don't handle re-export ambiguities here as each module now exports unique types
