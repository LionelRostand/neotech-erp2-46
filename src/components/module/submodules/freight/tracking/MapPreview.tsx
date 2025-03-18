
import React, { useEffect, useRef, useState } from 'react';
import { GeoLocation } from '@/types/freight';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, Map as MapIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MapPreviewProps {
  location?: GeoLocation;
  className?: string;
}

const MapPreview: React.FC<MapPreviewProps> = ({ location, className }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side rendering check
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !location || !mapContainerRef.current) return;

    const initializeMap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const L = await import('leaflet');
        
        // Clean up existing map if it exists
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }
        
        // Create new map
        const map = L.map(mapContainerRef.current).setView([location.latitude, location.longitude], 13);
        leafletMapRef.current = map;
        
        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
          attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
          minZoom: 1,
          maxZoom: 20
        }).addTo(map);
        
        // Create a marker with custom icon
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        
        // Add marker to map
        const marker = L.marker([location.latitude, location.longitude], { icon: customIcon });
        marker.addTo(map);
        
        // Add popup with location info
        marker.bindPopup(`
          <div>
            <div style="font-weight: 500;">${location.address || 'Location'}</div>
            <div>${location.city}, ${location.country}</div>
          </div>
        `).openPopup();
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    
    initializeMap();
    
    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [location, isClient]);

  if (!isClient) {
    return <div className={`bg-slate-100 ${className}`}>Loading map...</div>;
  }

  if (!location) {
    return (
      <Alert variant="default" className={className}>
        <Info className="h-4 w-4" />
        <AlertTitle>Localisation non disponible</AlertTitle>
        <AlertDescription>
          Aucune donnée GPS disponible pour cet événement.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`relative rounded-md overflow-hidden ${className || ''}`}>
      <div 
        ref={mapContainerRef} 
        className="bg-slate-200 h-full w-full min-h-[200px]"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 p-2 text-xs">
        <div className="font-semibold">{location.address}</div>
        <div>{location.postalCode} {location.city}, {location.country}</div>
        <div className="text-gray-500">
          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </div>
      </div>
    </div>
  );
};

export default MapPreview;
