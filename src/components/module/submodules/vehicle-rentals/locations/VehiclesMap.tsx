
import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Vehicle, Reservation, Client, Location } from '../types/rental-types';
import { MapPin } from 'lucide-react';
import LeafletCssPatch from '../../transport/patches/leaflet-css-patch';
import { getVehiclePopupContent } from '../../transport/utils/map-utils';

interface VehiclesMapProps {
  locations: Location[];
}

const VehiclesMap: React.FC<VehiclesMapProps> = ({ locations }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  
  const { data: vehicles = [] } = useQuery({
    queryKey: ['rentals', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.TRANSPORT.VEHICLES)
  });

  const { data: reservations = [] } = useQuery({
    queryKey: ['rentals', 'reservations'],
    queryFn: () => fetchCollectionData<Reservation>(COLLECTIONS.TRANSPORT.RESERVATIONS)
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['rentals', 'clients'],
    queryFn: () => fetchCollectionData<Client>(COLLECTIONS.TRANSPORT.CLIENTS)
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

        // Add markers for each vehicle with active reservation
        vehicles.forEach(vehicle => {
          const activeReservation = reservations.find(
            res => res.vehicleId === vehicle.id && res.status === 'active'
          );

          if (activeReservation) {
            const client = clients.find(c => c.id === activeReservation.clientId);
            const location = locations.find(l => l.name === activeReservation.pickupLocation);

            if (location && location.coordinates) {
              const marker = L.marker([location.coordinates.latitude, location.coordinates.longitude]).addTo(map);
              
              // Create popup content
              const popupContent = `
                <div class="p-3">
                  <h3 class="font-bold">${vehicle.name}</h3>
                  <p>Plaque: ${vehicle.licensePlate}</p>
                  <p>Status: ${vehicle.status}</p>
                  ${client ? `<p>Client: ${client.firstName} ${client.lastName}</p>` : ''}
                  <p>Du: ${activeReservation.startDate}</p>
                  <p>Au: ${activeReservation.endDate}</p>
                </div>
              `;
              
              marker.bindPopup(popupContent);
            }
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
  }, [vehicles, reservations, clients, locations]);

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
