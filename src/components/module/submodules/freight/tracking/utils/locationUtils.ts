
/**
 * Utilities for handling tracking locations
 */
import { GeoLocation, TrackingEvent } from '@/types/freight';

// Mock locations for package tracking
export const mockLocations: GeoLocation[] = [
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

// Helper function to get the latest location from a list of tracking events
export const getLatestLocationFromEvents = (events: TrackingEvent[]): GeoLocation | undefined => {
  // Get events with location data
  const eventsWithLocation = events.filter(event => event.location);
  
  if (eventsWithLocation.length === 0) {
    return undefined;
  }
  
  // Sort by timestamp (newest first) and get the first one
  const sortedEvents = [...eventsWithLocation].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return sortedEvents[0].location;
};
