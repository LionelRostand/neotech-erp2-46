
import { WebBookingService, TransportService } from '../types';

// Helper function to get service display name
export const getServiceDisplayName = (serviceType: TransportService): string => {
  switch (serviceType) {
    case 'airport': return 'Transfert Aéroport';
    case 'hourly': return 'Location à l\'heure';
    case 'pointToPoint': return 'Point à Point';
    case 'dayTour': return 'Excursion Journée';
    default: return serviceType;
  }
};

// Convert WebBookingService to TransportService
export const convertToTransportService = (service: WebBookingService): TransportService => {
  // Return the serviceType as a TransportService
  return service.serviceType as TransportService;
};

// Add missing functions
export const stringToTransportService = (serviceStr: string): TransportService => {
  switch (serviceStr) {
    case 'airport':
    case 'hourly':
    case 'pointToPoint':
    case 'dayTour':
      return serviceStr as TransportService;
    default:
      return serviceStr;
  }
};

export const transportServiceToString = (service: TransportService | { serviceType: string }): string => {
  if (typeof service === 'string') {
    return service;
  }
  return service.serviceType;
};
