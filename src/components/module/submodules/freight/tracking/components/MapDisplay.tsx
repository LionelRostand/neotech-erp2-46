
import React, { useEffect, useRef, useState } from 'react';
import { TrackingEvent } from '@/types/freight';
import { formatPackageStatus } from '../mockTrackingData';
import { MapPin } from 'lucide-react';

interface MapDisplayProps {
  events: TrackingEvent[];
  mapToken: string;
  error: string | null;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ events, mapToken, error }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const leafletMapRef = useRef<any>(null);
  const markerClustersRef = useRef<any>(null);

  // Initialize and update map when events change
  useEffect(() => {
    if (!mapRef.current || !mapToken || !events.length) return;
    
    const initializeMap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const L = await import('leaflet');
        
        // Initialize map if not already done
        if (!mapInitialized) {
          // Get events with location data
          const eventsWithLocation = events.filter(event => event.location);
          
          if (eventsWithLocation.length === 0) {
            return;
          }
          
          // Clean up existing map
          if (leafletMapRef.current) {
            leafletMapRef.current.remove();
            leafletMapRef.current = null;
          }
          
          // Get the most recent event with location
          const latestEvent = eventsWithLocation[0];
          const { latitude, longitude } = latestEvent.location!;
          
          // Create new map
          const map = L.map(mapRef.current).setView([latitude, longitude], 8);
          leafletMapRef.current = map;
          
          // Add tile layer (using OpenStreetMap)
          L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'données © OpenStreetMap/ODbL - rendu OSM France',
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
          
          setMapInitialized(true);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    
    initializeMap();
  }, [events, mapToken, mapInitialized]);

  // Helper function to get status color for markers
  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      delivered: "bg-green-500",
      shipped: "bg-blue-500",
      ready: "bg-purple-500",
      draft: "bg-gray-500",
      returned: "bg-amber-500",
      lost: "bg-red-500",
      exception: "bg-red-500",
      delayed: "bg-amber-500",
      in_transit: "bg-blue-500",
      processing: "bg-purple-500",
      registered: "bg-gray-500",
      out_for_delivery: "bg-teal-500"
    };
    
    return colorMap[status] || "bg-gray-500";
  };

  // Clean up map on component unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      className="h-[400px] w-full bg-slate-100 rounded-md relative"
    >
      {!events.length && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="text-gray-500">Entrez un numéro de référence pour localiser votre colis</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
