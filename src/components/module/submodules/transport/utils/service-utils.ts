
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
