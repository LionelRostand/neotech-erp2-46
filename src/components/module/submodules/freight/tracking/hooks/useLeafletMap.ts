
import { useEffect, useRef, useState } from 'react';
import { TrackingEvent } from '@/types/freight';
import { getStatusColor } from '../utils/statusUtils';
import { formatPackageStatus } from '../utils/statusUtils';

export const useLeafletMap = (
  mapElementRef: React.RefObject<HTMLDivElement>,
  events: TrackingEvent[],
  mapToken: string
) => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const leafletMapRef = useRef<any>(null);
  const markerClustersRef = useRef<any>(null);

  // Initialize and update map when events change
  useEffect(() => {
    if (!mapElementRef.current) return;
    
    const initializeMap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const L = await import('leaflet');
        
        // Initialize map if not already done
        if (!mapInitialized) {
          // Clean up existing map
          if (leafletMapRef.current) {
            leafletMapRef.current.remove();
            leafletMapRef.current = null;
          }
          
          // Coordonnées par défaut de Paris
          let latitude = 48.852969;
          let longitude = 2.349903;
          let zoom = 11;
          
          // Si nous avons des événements avec localisation, utilisons le plus récent
          const eventsWithLocation = events.filter(event => event.location);
          if (eventsWithLocation.length > 0) {
            const latestEvent = eventsWithLocation[0];
            latitude = latestEvent.location!.latitude;
            longitude = latestEvent.location!.longitude;
          }
          
          // Create new map
          const map = L.map(mapElementRef.current).setView([latitude, longitude], zoom);
          leafletMapRef.current = map;
          
          // Add tile layer (using OpenStreetMap France)
          L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20
          }).addTo(map);
          
          // Initialize marker cluster
          try {
            // Use marker cluster if available
            const markerClusterGroup = (L as any).markerClusterGroup;
            if (markerClusterGroup) {
              markerClustersRef.current = markerClusterGroup();
            }
          } catch (error) {
            console.log("Marker clustering not available, using standard markers");
          }
          
          // Only add markers if we have events with location
          if (events.length > 0) {
            const eventsWithLocation = events.filter(event => event.location);
            
            // Add markers for all events with location
            const markers: any[] = [];
            
            eventsWithLocation.forEach(event => {
              if (event.location) {
                const { latitude, longitude, city, country } = event.location;
                
                // Create custom icon
                const statusIcon = L.divIcon({
                  className: `tracking-marker-${event.status}`,
                  html: `<div class="w-8 h-8 rounded-full bg-white p-1 shadow-md flex items-center justify-center">
                    <div class="w-6 h-6 rounded-full ${getStatusColor(event.status)}"></div>
                  </div>`,
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                  popupAnchor: [0, -32]
                });
                
                const marker = L.marker([latitude, longitude], { icon: statusIcon });
                
                // Create popup content
                const popupContent = `
                  <div>
                    <h3 class="font-bold">${formatPackageStatus(event.status)}</h3>
                    <p>${city}, ${country}</p>
                    <p class="text-sm">${new Date(event.timestamp).toLocaleString('fr-FR')}</p>
                  </div>
                `;
                
                marker.bindPopup(popupContent);
                
                // Add to cluster if available, otherwise add directly to map
                if (markerClustersRef.current) {
                  markerClustersRef.current.addLayer(marker);
                } else {
                  marker.addTo(map);
                }
                
                markers.push(marker);
              }
            });
            
            // Add marker clusters to map if available
            if (markerClustersRef.current) {
              map.addLayer(markerClustersRef.current);
            }
            
            // Fit map to show all markers
            if (markers.length > 0) {
              try {
                const group = L.featureGroup(markers);
                map.fitBounds(group.getBounds().pad(0.5));
              } catch (error) {
                console.error("Error fitting bounds", error);
              }
            }
          }
          
          setMapInitialized(true);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    
    initializeMap();
  }, [events, mapInitialized, mapElementRef]);

  // Clean up map on component unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return { mapInitialized };
};
