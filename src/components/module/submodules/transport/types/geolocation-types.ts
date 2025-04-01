
// Définitions de types supplémentaires pour les fonctionnalités de géolocalisation

import { Coordinates } from './map-types';

export interface RouteSegment {
  startPoint: Coordinates;
  endPoint: Coordinates;
  distance: number;
  duration: number;
  polyline: string;
  trafficLevel?: 'low' | 'moderate' | 'high' | 'severe';
}

export interface RouteOptions {
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  avoidFerries?: boolean;
  optimizeWaypoints?: boolean;
  trafficAware?: boolean;
  departureTime?: Date | 'now';
  arrivalTime?: Date;
  transportMode?: 'car' | 'truck' | 'bicycle' | 'pedestrian';
}

export interface GeocodingResult {
  formattedAddress: string;
  coordinates: Coordinates;
  placeId?: string;
  components?: {
    street?: string;
    houseNumber?: string;
    neighborhood?: string;
    locality?: string;
    city?: string;
    county?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    countryCode?: string;
  };
}

export interface MapExtensionRequest {
  type: 'traffic' | 'satellite' | 'terrain' | 'heatmap';
  active: boolean;
  config?: Record<string, any>;
}
