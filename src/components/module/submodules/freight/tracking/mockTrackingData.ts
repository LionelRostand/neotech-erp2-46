
/**
 * Mock data for package tracking
 */
import { Package, TrackingEvent } from '@/types/freight';
import { mockPackages } from '../mockPackages';
import { generateTrackingEvents } from './utils/trackingEventUtils';
import { getLatestEvent } from './utils/trackingEventUtils';
import { getLatestLocationFromEvents } from './utils/locationUtils';
import { formatPackageStatus, getStatusColor } from './utils/statusUtils';

// Generate tracking events for each package
export const mockTrackingEvents = mockPackages.flatMap(generateTrackingEvents);

// Helper function to get tracking events for a specific package
export const getPackageTrackingEvents = (packageId: string): TrackingEvent[] => {
  return mockTrackingEvents.filter(event => event.packageId === packageId);
};

// Helper function to get a package by tracking number
export const getPackageByTrackingNumber = (trackingNumber: string): Package | undefined => {
  return mockPackages.find(pkg => pkg.trackingNumber === trackingNumber);
};

// Re-export utility functions for backward compatibility
export { getLatestLocationFromEvents, getLatestEvent, formatPackageStatus, getStatusColor };
