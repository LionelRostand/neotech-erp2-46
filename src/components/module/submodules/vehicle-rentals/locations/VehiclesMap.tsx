
import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import LeafletCssPatch from '../../transport/patches/leaflet-css-patch';
import { Location } from '../types/rental-types';
import { MapPin } from 'lucide-react';

const VehiclesMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  
  const { data: locations = [] } = useQuery({
    queryKey: ['rentals', 'locations'],
    queryFn: () => fetchCollectionData<Location>(COLLECTIONS.TRANSPORT.LOCATIONS)
  });

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    
    const initMap = async () => {
      try {
        // Load Leaflet dynamically
        const L = (window as any).L;
        if (!L) return;

        // Initialize map
        const map = L.map(mapRef.current).setView([48.852969, 2.349903], 11);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
          attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
          minZoom: 1,
          maxZoom: 20
        }).addTo(map);

        mapInstanceRef.current = map;

        // Add markers for each location
        locations.forEach(location => {
          if (location.coordinates) {
            const marker = L.marker([location.coordinates.latitude, location.coordinates.longitude]).addTo(map);
            marker.bindPopup(`
              <strong>${location.name}</strong><br>
              ${location.address}<br>
              ${location.phone || ''}
            `);
          }
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    // Initialize map after a short delay to ensure Leaflet is loaded
    setTimeout(initMap, 100);
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Carte des véhicules</h2>
      </div>

      {locations.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed rounded-lg p-8">
          <MapPin className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-600">Aucun véhicule localisé</p>
        </div>
      ) : (
        <>
          <LeafletCssPatch />
          <div ref={mapRef} className="h-[400px] rounded-lg overflow-hidden border" />
        </>
      )}
    </div>
  );
};

export default VehiclesMap;
