
import { TransportService } from '../types';

// Helper function to safely convert between string and TransportService
export function stringToTransportService(serviceString: string): TransportService {
  try {
    return JSON.parse(serviceString);
  } catch (e) {
    // Return a default service object if parsing fails
    return {
      id: 'default',
      name: 'Service par défaut',
      description: '',
      price: 0,
      duration: 0,
      serviceType: 'other',
      active: true
    };
  }
}

// Helper function to safely convert from TransportService to string
export function transportServiceToString(service: TransportService): string {
  try {
    return JSON.stringify(service);
  } catch (e) {
    return '{}';
  }
}

// Helper function to safely convert between TransportService[] and string[]
export function convertServiceList(services: TransportService[]): string[] {
  return services.map(service => transportServiceToString(service));
}

// Helper function to check if a service can be safely converted
export function isValidServiceString(serviceString: string): boolean {
  try {
    const parsed = JSON.parse(serviceString);
    return (
      typeof parsed === 'object' &&
      parsed !== null &&
      'id' in parsed &&
      'name' in parsed &&
      'price' in parsed &&
      'serviceType' in parsed
    );
  } catch (e) {
    return false;
  }
}
