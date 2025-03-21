
import React, { useEffect, useRef } from 'react';
import { Location } from '../types/rental-types';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from 'lucide-react';

// Import the leaflet types but we'll load the library dynamically
import type { Map as LeafletMap, LatLngTuple, LatLngBoundsExpression } from 'leaflet';

interface LocationMapProps {
  locations: Location[];
}

const LocationMap: React.FC<LocationMapProps> = ({ locations }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Dynamic import to avoid SSR issues
    const initializeMap = async () => {
      try {
        if (window.L) return; // Prevent multiple initializations
        
        // Load Leaflet CSS
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css';
        linkElement.integrity = 'sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==';
        linkElement.crossOrigin = '';
        document.head.appendChild(linkElement);
        
        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js';
        script.integrity = 'sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==';
        script.crossOrigin = '';
        
        script.onload = () => {
          if (!mapRef.current) return;
          
          // Initialize map once Leaflet is loaded
          // Default coordinates for Paris
          let lat = 48.852969;
          let lon = 2.349903;
          let zoom = 11;
          
          // If we have locations with coordinates, use the first one
          if (locations.length > 0 && locations[0].coordinates) {
            lat = locations[0].coordinates.latitude;
            lon = locations[0].coordinates.longitude;
          }
          
          // Use window.L to access Leaflet after it's loaded
          const map = window.L.map(mapRef.current).setView([lat, lon], zoom);
          
          // Add tile layer
          window.L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20
          }).addTo(map);
          
          // Add markers for each location
          locations.forEach(location => {
            if (location.coordinates) {
              const { latitude, longitude } = location.coordinates;
              
              const marker = window.L.marker([latitude, longitude]).addTo(map);
              marker.bindPopup(`
                <strong>${location.name}</strong><br>
                ${location.address}<br>
                ${location.phone}
              `);
            }
          });
          
          // Create a group for all markers to fit bounds
          if (locations.length > 1) {
            const markers: LatLngTuple[] = locations
              .filter(loc => loc.coordinates)
              .map(loc => [
                loc.coordinates?.latitude || 0, 
                loc.coordinates?.longitude || 0
              ]);
            
            if (markers.length > 0) {
              const bounds: LatLngBoundsExpression = markers;
              map.fitBounds(bounds);
            }
          }
        };
        
        document.body.appendChild(script);
      } catch (error) {
        console.error("Error initializing map", error);
      }
    };
    
    initializeMap();
    
    // Cleanup
    return () => {
      if (window.L && window.L.map) {
        // Clean up if needed
      }
    };
  }, [locations]);
  
  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div 
          ref={mapRef} 
          className="w-full h-[400px] rounded-md overflow-hidden"
          style={{ height: '400px' }}
        >
          {/* Map is rendered here */}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationMap;
