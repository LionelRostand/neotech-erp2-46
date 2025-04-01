
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

// Résoudre l'ambiguïté en ne réexportant pas les types dupliqués
// Ne pas réexporter MapExtensionRequest depuis geolocation-types car déjà exporté depuis map-types
