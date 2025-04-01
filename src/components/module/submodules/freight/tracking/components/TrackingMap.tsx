
import React, { useEffect, useRef } from 'react';
import { TrackingEvent } from '@/types/freight';
import { getTrackingMarkerHtml, getStatusColor, formatPackageStatus } from '../utils/statusUtils';
import { configureLeafletIcons } from '@/components/module/submodules/transport/utils/leaflet-icon-setup';
import 'leaflet/dist/leaflet.css';

interface TrackingMapProps {
  events: TrackingEvent[];
}

const TrackingMap: React.FC<TrackingMapProps> = ({ events }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        // Dynamic import of Leaflet to avoid SSR issues
        const L = await configureLeafletIcons();
        
        // Clear previous map instance if it exists
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          markersRef.current = [];
        }
        
        // Set default center (Paris)
        let center: [number, number] = [48.856614, 2.3522219];
        let zoom = 5;
        
        // If we have events with location, use the most recent one for center
        const eventsWithLocation = events.filter(event => event.location);
        if (eventsWithLocation.length > 0) {
          const latestEvent = eventsWithLocation[0];
          center = [latestEvent.location!.latitude, latestEvent.location!.longitude];
          zoom = 10;
        }
        
        // Create map instance
        const map = L.map(mapRef.current).setView(center, zoom);
        mapInstanceRef.current = map;
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);
        
        // Add markers for all events with location
        const markers: any[] = [];
        
        eventsWithLocation.forEach((event, index) => {
          if (event.location) {
            const { latitude, longitude } = event.location;
            
            // Create marker icon
            const markerIcon = L.divIcon({
              className: `tracking-marker-${event.status}`,
              html: getTrackingMarkerHtml(event.status),
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              popupAnchor: [0, -16]
            });
            
            // Create marker
            const marker = L.marker([latitude, longitude], { 
              icon: markerIcon, 
              zIndexOffset: eventsWithLocation.length - index // Latest events above older ones
            }).addTo(map);
            
            // Create popup content
            const popupContent = `
              <div class="p-3">
                <h3 class="font-bold">${formatEventStatus(event.status)}</h3>
                <p class="text-sm">${event.description}</p>
                <p class="text-sm text-muted-foreground">${formatEventLocation(event.location)}</p>
                <p class="text-sm text-muted-foreground">${new Date(event.timestamp).toLocaleString('fr-FR')}</p>
              </div>
            `;
            
            marker.bindPopup(popupContent);
            markers.push(marker);
          }
        });
        
        markersRef.current = markers;
        
        // Draw path between markers if we have more than one
        if (markers.length > 1) {
          const points = eventsWithLocation
            .filter(event => event.location)
            .map(event => [event.location!.latitude, event.location!.longitude]);
          
          // Type assertion for Leaflet's LatLngExpression[]
          L.polyline(points as [number, number][], { 
            color: '#3b82f6', 
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 5' 
          }).addTo(map);
        }
        
        // Fit map to show all markers
        if (markers.length > 0) {
          const group = L.featureGroup(markers);
          map.fitBounds(group.getBounds().pad(0.2));
        }
        
      } catch (error) {
        console.error('Error initializing Leaflet map:', error);
      }
    };
    
    initMap();
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, [events]);
  
  // Helper functions
  const formatEventStatus = (status: string): string => {
    const statusLabels: Record<string, string> = {
      'delivered': 'Livré',
      'in_transit': 'En transit',
      'processing': 'En traitement',
      'registered': 'Enregistré',
      'out_for_delivery': 'En cours de livraison',
      'delayed': 'Retardé',
      'exception': 'Problème',
      'returned': 'Retourné'
    };
    
    return statusLabels[status] || status;
  };
  
  const formatEventLocation = (location: any): string => {
    if (!location) return '';
    
    const parts = [
      location.address,
      location.city,
      location.postalCode,
      location.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return (
    <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-md overflow-hidden"></div>
  );
};

export default TrackingMap;
