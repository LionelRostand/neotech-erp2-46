
import { TransportVehicle } from './transport-types';

export interface VehicleLocation {
  lat: number;
  lng: number;
  lastUpdate: string;
  speed: number;
  status: string;
}

export interface TransportVehicleWithLocation extends TransportVehicle {
  location?: VehicleLocation;
}

export interface MapConfig {
  zoom: number;
  centerLat: number;
  centerLng: number;
  tileProvider: 'osm' | 'osm-france' | 'carto';
  showLabels: boolean;
}

export interface MapHookResult {
  mapInitialized: boolean;
  mapConfig: MapConfig;
  setMapConfig: React.Dispatch<React.SetStateAction<MapConfig>>;
  refreshMap: () => void;
}
