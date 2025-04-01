
import { TransportService } from '../types';

/**
 * Convert transport service string to enum value
 * @param serviceStr Service string
 * @returns The transport service type
 */
export const stringToTransportService = (serviceStr: string): TransportService => {
  switch (serviceStr.toLowerCase()) {
    case 'airport':
      return 'airport';
    case 'hourly':
      return 'hourly';
    case 'pointtopoint':
    case 'point-to-point':
    case 'point_to_point':
      return 'pointToPoint';
    case 'daytour':
    case 'day-tour':
    case 'day_tour':
      return 'dayTour';
    default:
      return serviceStr as TransportService;
  }
};

/**
 * Convert transport service enum value to string
 * @param service The service enum value
 * @returns The service string representation
 */
export const transportServiceToString = (service: TransportService): string => {
  switch (service) {
    case 'airport':
      return 'airport';
    case 'hourly':
      return 'hourly';
    case 'pointToPoint':
      return 'pointToPoint';
    case 'dayTour':
      return 'dayTour';
    default:
      return service.toString();
  }
};

/**
 * Get a human-readable service name
 * @param service The service type
 * @returns Human-readable service name
 */
export const getServiceDisplayName = (service: TransportService | string): string => {
  const serviceStr = typeof service === 'string' ? service : transportServiceToString(service);
  
  switch (serviceStr) {
    case 'airport':
      return 'Transfert Aéroport';
    case 'hourly':
      return 'Service horaire';
    case 'pointToPoint':
      return 'Point à point';
    case 'dayTour':
      return 'Tour journalier';
    default:
      return serviceStr;
  }
};

/**
 * Calculate the estimated price for a service
 * @param service Service type
 * @param distance Distance in km (if applicable)
 * @param hours Hours (if applicable)
 * @returns Estimated price
 */
export const calculateServicePrice = (
  service: TransportService | string,
  distance?: number,
  hours?: number
): number => {
  const serviceStr = typeof service === 'string' ? service : transportServiceToString(service);
  
  switch (serviceStr) {
    case 'airport':
      return (distance || 0) * 2.5 + 35;
    case 'hourly':
      return (hours || 0) * 65;
    case 'pointToPoint':
      return (distance || 0) * 1.8 + 15;
    case 'dayTour':
      return 450;
    default:
      return 0;
  }
};
