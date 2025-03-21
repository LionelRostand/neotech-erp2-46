
// Re-export all types from their respective files
export * from './base-types';
export * from './vehicle-types';
export * from './driver-types';
export * from './reservation-types';
export * from './client-types';

// Create a backward compatibility layer to avoid breaking imports
// This way code that imports from transport-types.ts will still work
