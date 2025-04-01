
// Re-export all types from the specific type modules
export * from './base-types';
export * from './vehicle-types';
export * from './driver-types';
export * from './geolocation-types';
export * from './map-types';
export * from './client-types';
export * from './reservation-types';
export * from './planning-types';
export * from './integration-types';

// Re-export with aliases to avoid ambiguity
import type { MapExtensionRequest as MER } from './map-types';
export type { MER as ExtensionRequestType };
