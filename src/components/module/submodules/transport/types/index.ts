
// Export all types from the submodules
export * from './driver-types';
export * from './vehicle-types';
export * from './reservation-types';
export * from './client-types';
export * from './map-types';
export * from './service-types';

// Fix for the MapExtensionRequest issues
export type { MapExtensionRequest } from './map-types';
