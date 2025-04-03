
import { TransportService } from '../types';

// Define a type for service options
export type ServiceOption = {
  name: string;
  type: string;
  description?: string;
};

// Service options
export const serviceOptions: ServiceOption[] = [
  { name: 'Airport Transfer', type: 'airport' },
  { name: 'City Tour', type: 'tour' },
  { name: 'Business Transport', type: 'business' },
  { name: 'Wedding', type: 'event' },
  { name: 'Conference', type: 'event' },
  { name: 'Other', type: 'other' }
];

// Convert service string to enum
export const stringToService = (serviceStr: string): ServiceOption => {
  const foundService = serviceOptions.find(service => service.type === serviceStr);
  return foundService || { name: 'Unknown Service', type: 'other' };
};

// Convert service enum to string
export const serviceToString = (service: ServiceOption): string => {
  return service.type;
};

