
/**
 * Utilities for generating and managing tracking events
 */
import { format, subDays, subHours } from 'date-fns';
import { Package, TrackingEvent } from '@/types/freight';
import { mockLocations } from './locationUtils';

// Helper function to get the latest event from a list of tracking events
export const getLatestEvent = (events: TrackingEvent[]): TrackingEvent | undefined => {
  if (events.length === 0) {
    return undefined;
  }
  
  // Sort by timestamp (newest first) and get the first one
  return [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
};

// Helper function to generate random tracking events for a package
export const generateTrackingEvents = (packageData: Package): TrackingEvent[] => {
  const events: TrackingEvent[] = [];
  const now = new Date();
  
  // Define possible statuses based on the package's current status
  let possibleStatuses: { status: string; description: string }[] = [];
  
  switch (packageData.status) {
    case 'delivered':
      possibleStatuses = [
        { status: 'registered', description: 'Colis enregistré dans notre système' },
        { status: 'processing', description: 'Colis en cours de traitement dans notre entrepôt' },
        { status: 'in_transit', description: 'Colis en transit vers le centre de distribution' },
        { status: 'in_transit', description: 'Colis arrivé au centre de distribution' },
        { status: 'out_for_delivery', description: 'Colis en cours de livraison' },
        { status: 'delivered', description: 'Colis livré avec succès' },
      ];
      break;
      
    case 'shipped':
      possibleStatuses = [
        { status: 'registered', description: 'Colis enregistré dans notre système' },
        { status: 'processing', description: 'Colis en cours de traitement dans notre entrepôt' },
        { status: 'in_transit', description: 'Colis en transit vers le centre de distribution' },
        { status: 'in_transit', description: 'Colis arrivé au centre de distribution' },
      ];
      break;
      
    case 'lost':
      possibleStatuses = [
        { status: 'registered', description: 'Colis enregistré dans notre système' },
        { status: 'processing', description: 'Colis en cours de traitement dans notre entrepôt' },
        { status: 'in_transit', description: 'Colis en transit vers le centre de distribution' },
        { status: 'exception', description: 'Problème lors de la livraison' },
        { status: 'lost', description: 'Colis déclaré perdu' },
      ];
      break;
      
    case 'returned':
      possibleStatuses = [
        { status: 'registered', description: 'Colis enregistré dans notre système' },
        { status: 'processing', description: 'Colis en cours de traitement dans notre entrepôt' },
        { status: 'in_transit', description: 'Colis en transit vers le centre de distribution' },
        { status: 'exception', description: 'Tentative de livraison échouée' },
        { status: 'returned', description: 'Colis retourné à l\'expéditeur' },
      ];
      break;
      
    default:
      possibleStatuses = [
        { status: 'registered', description: 'Colis enregistré dans notre système' },
        { status: 'processing', description: 'Colis en cours de traitement dans notre entrepôt' },
      ];
  }
  
  // Generate events based on possible statuses
  possibleStatuses.forEach((status, index) => {
    // Calculate timestamp based on index (older events first)
    const timestamp = format(
      index === possibleStatuses.length - 1 
        ? subHours(now, Math.random() * 24) // Latest event within last 24 hours
        : subDays(now, possibleStatuses.length - index), // Earlier events on preceding days
      "yyyy-MM-dd'T'HH:mm:ss'Z'"
    );
    
    // Get a random location or undefined for some events
    const location = index > 0 && Math.random() > 0.3 
      ? mockLocations[Math.floor(Math.random() * mockLocations.length)]
      : undefined;
    
    events.push({
      id: `event-${packageData.id}-${index}`,
      packageId: packageData.id,
      timestamp,
      status: status.status as any,
      location,
      description: status.description,
      isNotified: Math.random() > 0.2, // 80% chance it's been notified
    });
  });
  
  // Sort events by timestamp
  return events.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};
