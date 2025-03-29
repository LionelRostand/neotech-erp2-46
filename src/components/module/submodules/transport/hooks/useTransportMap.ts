
import { useEffect, useRef, useState } from 'react';
import { TransportVehicle } from '../types/transport-types';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

interface VehicleLocation {
  lat: number;
  lng: number;
  lastUpdate: string;
  speed: number;
  status: string;
}

interface TransportVehicleWithLocation extends TransportVehicle {
  location?: VehicleLocation;
}

interface MapConfig {
  zoom: number;
  centerLat: number;
  centerLng: number;
  tileProvider: 'osm' | 'osm-france' | 'carto';
  showLabels: boolean;
}

export const useTransportMap = (
  mapElementRef: React.RefObject<HTMLDivElement>,
  vehicles: TransportVehicleWithLocation[],
  initialConfig?: Partial<MapConfig>
) => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    zoom: 11,
    centerLat: 48.852969,
    centerLng: 2.349903,
    tileProvider: 'osm-france',
    showLabels: true,
    ...initialConfig
  });

  // Initialize and update map when vehicles or config change
  useEffect(() => {
    if (!mapElementRef.current) return;
    
    const initializeMap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const L = await import('leaflet');
        
        // Fix Leaflet icon paths issue - this is crucial for marker display
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
        
        // Initialize map if not already done
        if (!mapInitialized) {
          // Clean up existing map
          if (leafletMapRef.current) {
            leafletMapRef.current.remove();
            leafletMapRef.current = null;
          }
          
          // Set initial coordinates
          let latitude = mapConfig.centerLat;
          let longitude = mapConfig.centerLng;
          let zoom = mapConfig.zoom;
          
          // Si nous avons des véhicules avec localisation, utilisons le centre
          const vehiclesWithLocation = vehicles.filter(v => v.location);
          if (vehiclesWithLocation.length > 0) {
            // Calculate center based on all vehicle positions
            const bounds = vehiclesWithLocation.map(v => [v.location!.lat, v.location!.lng]);
            if (bounds.length > 0) {
              const firstVehicle = vehiclesWithLocation[0];
              latitude = firstVehicle.location!.lat;
              longitude = firstVehicle.location!.lng;
            }
          }
          
          // Create new map with correct sizing and options
          const map = L.map(mapElementRef.current, {
            zoomControl: true,
            attributionControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            dragging: true,
            maxBounds: [[-90, -180], [90, 180]]
          }).setView([latitude, longitude], zoom);
          
          leafletMapRef.current = map;
          
          // Add tile layer based on config
          let tileLayer;
          switch (mapConfig.tileProvider) {
            case 'osm':
              tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                minZoom: 1,
                maxZoom: 19
              });
              break;
            case 'carto':
              tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                minZoom: 1,
                maxZoom: 19
              });
              break;
            case 'osm-france':
            default:
              tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
                minZoom: 1,
                maxZoom: 20
              });
              break;
          }
          
          tileLayer.addTo(map);
          
          // Ensure map properly sizes itself - critical for proper display
          setTimeout(() => {
            map.invalidateSize(true);
          }, 500);

          setMapInitialized(true);
        }
        
        // Add or update markers for all vehicles with location
        if (mapInitialized && leafletMapRef.current) {
          // Force map to update its container size again after initialization
          leafletMapRef.current.invalidateSize(true);
          
          // Clear existing markers
          markersRef.current.forEach(marker => {
            marker.remove();
          });
          markersRef.current = [];
          
          // Add new markers
          const vehiclesWithLocation = vehicles.filter(v => v.location);
          const markers: any[] = [];
          
          vehiclesWithLocation.forEach(vehicle => {
            if (vehicle.location) {
              const { lat, lng } = vehicle.location;
              
              // Create custom icon based on vehicle status
              let iconColor = "#4CAF50"; // Default green
              
              if (vehicle.location.status === "arrêté") {
                iconColor = "#FFC107"; // Yellow for stopped
              } else if (vehicle.location.status === "maintenance") {
                iconColor = "#FF9800"; // Orange for maintenance
              }
              
              const customIcon = L.divIcon({
                className: `vehicle-marker-${vehicle.id}`,
                html: `<div style="background-color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                  <div style="background-color: ${iconColor}; width: 24px; height: 24px; border-radius: 50%;"></div>
                </div>`,
                iconSize: [36, 36],
                iconAnchor: [18, 18]
              });
              
              const marker = L.marker([lat, lng], { icon: customIcon });
              
              // Create popup for vehicle info
              const popupContent = mapConfig.showLabels 
                ? `
                  <div>
                    <h3 style="font-weight: bold; margin-bottom: 5px;">${vehicle.name}</h3>
                    <p style="margin-bottom: 3px;">Immatriculation: ${vehicle.licensePlate}</p>
                    <p style="margin-bottom: 3px;">Statut: ${vehicle.location.status}</p>
                    <p style="margin-bottom: 3px;">Vitesse: ${vehicle.location.speed} km/h</p>
                    <p style="margin-bottom: 3px;">Dernière mise à jour: ${new Date(vehicle.location.lastUpdate).toLocaleTimeString('fr-FR')}</p>
                  </div>
                `
                : `<div><p>${vehicle.name}</p></div>`;
              
              marker.bindPopup(popupContent);
              
              marker.addTo(leafletMapRef.current);
              markers.push(marker);
            }
          });
          
          markersRef.current = markers;
          
          // Fit map to show all markers if we have any
          if (markers.length > 0) {
            try {
              const group = L.featureGroup(markers);
              leafletMapRef.current.fitBounds(group.getBounds().pad(0.2));
            } catch (error) {
              console.error("Error fitting bounds", error);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    
    initializeMap();
  }, [vehicles, mapInitialized, mapElementRef, mapConfig]);

  // Clean up map on component unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return { 
    mapInitialized,
    mapConfig,
    setMapConfig,
    refreshMap: () => setMapInitialized(false)
  };
};
