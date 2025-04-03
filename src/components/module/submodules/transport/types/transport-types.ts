
// Re-export and types that need to be commonly accessible
import { TransportService, TransportServiceDetails } from './service-types';

// Export service types
export { TransportService, TransportServiceDetails };

// Re-export utility functions
export { stringToService, serviceToString } from '../utils/service-utils';

// Any other types specific to transport module can be defined here
export interface TransportSettings {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  businessHours: {
    open: string;
    close: string;
  };
  defaultCurrency: string;
  taxRate: number;
}
