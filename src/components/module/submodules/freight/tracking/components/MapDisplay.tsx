
import React, { useRef, useEffect } from 'react';
import { TrackingEvent } from '@/types/freight';
import { MapPin } from 'lucide-react';

interface MapDisplayProps {
  events: TrackingEvent[];
  mapToken: string;
  error: string | null;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ events, mapToken, error }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Initialize the map
    const initializeMap = async () => {
      try {
        // Coordonnées par défaut de Paris
        let latitude = 48.852969;
        let longitude = 2.349903;
        
        // Si nous avons des événements avec localisation, utilisons le plus récent
        const eventsWithLocation = events.filter(event => event.location);
        if (eventsWithLocation.length > 0) {
          const latestEvent = eventsWithLocation[0];
          latitude = latestEvent.location!.latitude;
          longitude = latestEvent.location!.longitude;
        }
        
        // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
        const L = await import('leaflet');
        
        // Clean up existing map if it exists (avoiding TypeScript errors)
        const mapContainer = mapRef.current;
        // @ts-ignore - Leaflet adds these properties at runtime
        if (mapContainer && mapContainer._leaflet_id) {
          // @ts-ignore - Accessing Leaflet-specific property
          mapContainer._leaflet = null;
        }
        
        const map = L.map(mapRef.current).setView([latitude, longitude], 11);
        
        // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer.
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
          // Il est toujours bien de laisser le lien vers la source des données
          attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
          minZoom: 1,
          maxZoom: 20
        }).addTo(map);

        // Ajouter des marqueurs pour chaque événement avec une localisation
        if (events.length > 0) {
          const eventsWithLocation = events.filter(event => event.location);
          eventsWithLocation.forEach(event => {
            if (event.location) {
              const { latitude, longitude, city, country } = event.location;
              const marker = L.marker([latitude, longitude]).addTo(map);
              marker.bindPopup(`<b>${event.status}</b><br>${city}, ${country}<br>${new Date(event.timestamp).toLocaleString('fr-FR')}`);
            }
          });
          
          // Si nous avons des événements avec localisation, ajustons la vue pour les voir tous
          if (eventsWithLocation.length > 0) {
            const latlngs = eventsWithLocation
              .filter(event => event.location)
              .map(event => [event.location!.latitude, event.location!.longitude]);
            
            if (latlngs.length > 0) {
              try {
                const bounds = L.latLngBounds(latlngs.map(coords => L.latLng(coords[0], coords[1])));
                map.fitBounds(bounds, { padding: [50, 50] });
              } catch (e) {
                console.error("Error setting bounds:", e);
              }
            }
          }
        }
        
        // Add resize handler to ensure map renders correctly when container changes size
        const handleResize = () => {
          if (map) {
            map.invalidateSize();
          }
        };
        
        window.addEventListener('resize', handleResize);
        
        // Force a resize after a short delay to ensure the map renders
        setTimeout(() => handleResize(), 500);
        
        // Nettoyage lors du démontage
        return () => {
          window.removeEventListener('resize', handleResize);
          map.remove();
        };
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    
    initializeMap();
  }, [events, mapToken]);  // Réinitialiser la carte lorsque les événements ou le token changent

  return (
    <div 
      ref={mapRef} 
      className="h-[400px] w-full bg-slate-100 rounded-md relative"
      id="map"
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
