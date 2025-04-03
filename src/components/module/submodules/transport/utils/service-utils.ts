
// Import the correct type from service-types directly
import type { TransportService } from '../types/service-types';

/**
 * Convert a string to a service object
 */
export const stringToService = (serviceString: string): TransportService | null => {
  if (!serviceString) return null;
  
  try {
    return JSON.parse(serviceString);
  } catch (e) {
    console.error('Error parsing service string:', e);
    return null;
  }
};

/**
 * Convert a service object to a string
 */
export const serviceToString = (service: TransportService): string => {
  if (!service) return '';
  
  try {
    return JSON.stringify(service);
  } catch (e) {
    console.error('Error stringifying service:', e);
    return '';
  }
};
