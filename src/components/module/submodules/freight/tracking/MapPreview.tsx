
import React, { useEffect, useRef } from 'react';
import { GeoLocation } from '@/types/freight';
import { Package } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface MapPreviewProps {
  location: GeoLocation;
  className?: string;
}

const MapPreview: React.FC<MapPreviewProps> = ({ location, className = "h-[300px]" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    const initMap = async () => {
      try {
        // Import dynamique de Leaflet pour éviter les problèmes de SSR
        const L = await import('leaflet').then(m => m.default);
        
        // Nettoyer l'instance précédente si elle existe
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        
        // Créer l'instance de la carte
        const map = L.map(mapRef.current).setView([location.latitude, location.longitude], 13);
        mapInstanceRef.current = map;
        
        // Ajouter la couche de tuiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);
        
        // Créer un marqueur
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div class="bg-primary text-white p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package">
                    <path d="m12.89 1.45 8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0Z"></path>
                    <path d="M2.32 6.16 12 11l9.68-4.84"></path>
                    <path d="M12 22.76V11"></path>
                  </svg>
                </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        
        const marker = L.marker([location.latitude, location.longitude], { icon }).addTo(map);
        
        // Ajouter un popup
        const popupContent = `
          <div class="p-2">
            <div class="font-bold">${location.city || 'Location'}</div>
            <div class="text-sm">${[location.address, location.postalCode, location.country].filter(Boolean).join(', ')}</div>
          </div>
        `;
        
        marker.bindPopup(popupContent).openPopup();
        
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte', error);
      }
    };
    
    initMap();
    
    // Nettoyer la carte lors du démontage
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location]);
  
  return (
    <div ref={mapRef} className={`w-full ${className}`}></div>
  );
};

export default MapPreview;
