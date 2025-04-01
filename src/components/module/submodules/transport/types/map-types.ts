
// Définition des types liés aux cartes pour le module Transport

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface VehicleLocation extends Coordinates {
  id: string;
  vehicleId?: string;
  timestamp: string;
  speed?: number;
  heading?: number;
  altitude?: number;
  accuracy?: number;
  status?: 'moving' | 'stopped' | 'idle' | 'offline';
  lastUpdate?: string;
}

export interface MapConfig {
  center: Coordinates;
  zoom: number;
  provider: 'osm' | 'mapbox' | 'google' | 'osm-france' | 'carto';
  style?: string;
  apiKey?: string;
  showTraffic?: boolean;
  showPOIs?: boolean;
  showLabels?: boolean;
}

export interface MapExtensionRequest {
  type: 'traffic' | 'satellite' | 'terrain' | 'heatmap';
  active: boolean;
  config?: Record<string, any>;
}

export interface MapFilter {
  type: 'vehicle' | 'driver' | 'zone';
  value: string;
  active: boolean;
}

export interface LocationHistoryEntry extends Coordinates {
  timestamp: string;
  speed: number;
  status: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'circle' | 'polygon' | 'rectangle';
  coordinates: Coordinates[];
  radius?: number;
  color: string;
  alerts?: boolean;
}

// Ne pas réexporter MapExtensionRequest puisqu'il est déjà exporté dans ce fichier
