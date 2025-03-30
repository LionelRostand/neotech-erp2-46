
import { MarkerClusterGroup } from 'leaflet';
import * as L from 'leaflet';

declare global {
  interface Window {
    map?: L.Map;
    markers?: L.LayerGroup;
    markerClusterGroup?: L.MarkerClusterGroup;
  }
}

// Extend Leaflet namespace
declare module 'leaflet' {
  interface MarkerClusterGroupOptions {
    maxClusterRadius?: number;
    disableClusteringAtZoom?: number;
  }
  
  export class MarkerClusterGroup extends L.FeatureGroup {
    constructor(options?: MarkerClusterGroupOptions);
    addLayer(layer: L.Layer): this;
  }
  
  export function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup;
}
