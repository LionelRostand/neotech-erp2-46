
import { TrackingEvent, GeoLocation } from '@/types/freight';

// Mock locations data for testing and development
export const mockLocations: GeoLocation[] = [
  {
    latitude: 48.856614,
    longitude: 2.3522219,
    address: "12 Rue de Rivoli",
    city: "Paris",
    country: "France",
    postalCode: "75001"
  },
  {
    latitude: 51.5074,
    longitude: -0.1278,
    address: "10 Downing Street",
    city: "London",
    country: "United Kingdom",
    postalCode: "SW1A 2AA"
  },
  {
    latitude: 40.7128,
    longitude: -74.0060,
    address: "350 Fifth Avenue",
    city: "New York",
    country: "United States",
    postalCode: "10118"
  },
  {
    latitude: 35.6762,
    longitude: 139.6503,
    address: "1-1 Chiyoda",
    city: "Tokyo",
    country: "Japan",
    postalCode: "100-8111"
  },
  {
    latitude: 52.5200,
    longitude: 13.4050,
    address: "Unter den Linden 77",
    city: "Berlin",
    country: "Germany",
    postalCode: "10117"
  }
];

export function getLatestLocationFromEvents(events: TrackingEvent[]): GeoLocation | undefined {
  if (!events || events.length === 0) return undefined;
  
  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Find the first event with location data
  for (const event of sortedEvents) {
    if (event.location) {
      return event.location;
    }
  }
  
  return undefined;
}

export function calculateDistance(location1: GeoLocation, location2: GeoLocation): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(location2.latitude - location1.latitude);
  const dLon = deg2rad(location2.longitude - location1.longitude);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(location1.latitude)) * Math.cos(deg2rad(location2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

export function formatAddress(location: GeoLocation): string {
  if (!location) return '';
  
  const parts = [
    location.address,
    location.city,
    location.postalCode,
    location.country
  ].filter(Boolean);
  
  return parts.join(', ');
}
