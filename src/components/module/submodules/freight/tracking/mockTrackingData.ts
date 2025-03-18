
import { Package, TrackingEvent, GeoLocation } from '@/types/freight';
import { mockPackages } from '../mockPackages';
import { addDays, subDays, subHours, format } from 'date-fns';

// Mock locations for package tracking
const mockLocations: GeoLocation[] = [
  {
    latitude: 48.856614,
    longitude: 2.3522219,
    address: "3 Rue de Rivoli",
    city: "Paris",
    country: "France",
    postalCode: "75001",
  },
  {
    latitude: 45.764043,
    longitude: 4.835659,
    address: "20 Place Bellecour",
    city: "Lyon",
    country: "France",
    postalCode: "69002",
  },
  {
    latitude: 43.296482,
    longitude: 5.36978,
    address: "56 La Canebière",
    city: "Marseille",
    country: "France",
    postalCode: "13001",
  },
  {
    latitude: 50.6311634,
    longitude: 3.0599573,
    address: "15 Rue de Paris",
    city: "Lille",
    country: "France",
    postalCode: "59000",
  },
  {
    latitude: 51.507351,
    longitude: -0.127758,
    address: "10 Downing Street",
    city: "London",
    country: "United Kingdom",
    postalCode: "SW1A 2AA",
  },
  {
    latitude: 40.416775,
    longitude: -3.70379,
    address: "Puerta del Sol",
    city: "Madrid",
    country: "Spain",
    postalCode: "28013",
  },
  {
    latitude: 52.520008,
    longitude: 13.404954,
    address: "Unter den Linden 77",
    city: "Berlin",
    country: "Germany",
    postalCode: "10117",
  },
  {
    latitude: 41.902783,
    longitude: 12.496366,
    address: "Via dei Fori Imperiali 1",
    city: "Rome",
    country: "Italy",
    postalCode: "00186",
  },
];

// Helper function to generate random tracking events for a package
const generateTrackingEvents = (packageData: Package): TrackingEvent[] => {
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

// Helper function to format package status for display
export const formatPackageStatus = (status: string): string => {
  switch (status) {
    case 'registered': return 'Enregistré';
    case 'processing': return 'En traitement';
    case 'in_transit': return 'En transit';
    case 'out_for_delivery': return 'En cours de livraison';
    case 'delivered': return 'Livré';
    case 'delayed': return 'Retardé';
    case 'exception': return 'Problème';
    case 'returned': return 'Retourné';
    case 'lost': return 'Perdu';
    case 'draft': return 'Brouillon';
    case 'ready': return 'Prêt';
    case 'shipped': return 'Expédié';
    default: return status;
  }
};

// Helper function to get status color
export const getStatusColor = (status: string): "success" | "warning" | "danger" => {
  switch (status) {
    case 'delivered':
      return 'success';
    case 'in_transit':
    case 'processing':
    case 'registered':
    case 'out_for_delivery':
    case 'shipped':
    case 'ready':
      return 'warning';
    case 'delayed':
    case 'exception':
    case 'returned':
    case 'lost':
    case 'draft':
    default:
      return 'danger';
  }
};
