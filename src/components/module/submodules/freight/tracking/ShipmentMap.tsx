
import React, { useRef, useEffect } from 'react';
import { Package, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { mockLocations } from './utils/locationUtils';
import { configureLeafletIcons } from '@/components/module/submodules/transport/utils/leaflet-icon-setup';
import 'leaflet/dist/leaflet.css';

interface ShipmentMapProps {
  events: any[];
  trackingCode: string;
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ events, trackingCode }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapType, setMapType] = React.useState<string>('roadmap');
  const [mapError, setMapError] = React.useState<boolean>(false);

  // Filtrer les événements qui ont des coordonnées de localisation
  const locatedEvents = events.filter(event => event.location && event.location.latitude && event.location.longitude);
  
  // Si aucun événement n'a de coordonnées, utiliser des coordonnées par défaut
  if (locatedEvents.length === 0 && events.length > 0) {
    // Ajouter des coordonnées fictives aux événements existants
    events.forEach((event, index) => {
      if (index < mockLocations.length) {
        event.location = mockLocations[index];
      }
    });
  }

  // Initialiser et dessiner la carte
  useEffect(() => {
    if (!mapRef.current || events.length === 0) return;
    
    const initMap = async () => {
      try {
        // Clean up previous map if it exists
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          markersRef.current = [];
        }
        
        // Load Leaflet with configured icons
        const L = await configureLeafletIcons();
        
        // Default center (Paris)
        let center: [number, number] = [48.856614, 2.3522219];
        let zoom = 5;
        
        // If we have events with location, use the most recent one for center
        if (locatedEvents.length > 0) {
          const latestEvent = locatedEvents[0];
          center = [latestEvent.location.latitude, latestEvent.location.longitude];
          zoom = 10;
        }
        
        // Create map with the selected style
        const map = L.map(mapRef.current).setView(center, zoom);
        mapInstanceRef.current = map;
        
        // Add appropriate tile layer based on mapType
        if (mapType === 'satellite') {
          L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Imagery &copy; Esri',
            maxZoom: 19
          }).addTo(map);
        } else {
          L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            maxZoom: 19
          }).addTo(map);
        }
        
        // Add markers for events with location
        const markers: any[] = [];
        
        events.forEach((event, index) => {
          if (!event.location) return;
          
          const { latitude, longitude } = event.location;
          
          // Create custom icon based on event type
          const iconOptions: any = {
            className: `event-marker-${event.type}`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
          };
          
          let iconHtml = '';
          const colorClass = getEventColor(event.type);
          
          iconHtml = `<div class="w-8 h-8 rounded-full bg-white p-1 shadow-md flex items-center justify-center">
            <div class="w-6 h-6 rounded-full ${colorClass}"></div>
          </div>`;
          
          iconOptions.html = iconHtml;
          
          const icon = L.divIcon(iconOptions);
          
          // Create marker
          const marker = L.marker([latitude, longitude], { 
            icon: icon, 
            zIndexOffset: events.length - index // Latest events above older ones
          }).addTo(map);
          
          // Create popup content
          const popupContent = `
            <div class="p-3">
              <h3 class="font-bold">${getEventTypeLabel(event.type)}</h3>
              <p class="text-sm">${event.description}</p>
              <p class="text-sm text-muted-foreground">
                ${event.location.city}, ${event.location.country}
              </p>
              <p class="text-sm text-muted-foreground">
                ${new Date(event.timestamp).toLocaleString('fr-FR')}
              </p>
            </div>
          `;
          
          marker.bindPopup(popupContent);
          markers.push(marker);
        });
        
        markersRef.current = markers;
        
        // Draw path between markers if we have more than one
        if (markers.length > 1) {
          const points = events
            .filter(event => event.location)
            .map(event => [event.location.latitude, event.location.longitude]);
          
          L.polyline(points, { 
            color: '#3b82f6', 
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 5' 
          }).addTo(map);
        }
        
        // Fit map to show all markers
        if (markers.length > 0) {
          try {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.2));
          } catch (error) {
            console.error("Error fitting bounds", error);
          }
        }
        
        // Add package info card
        const infoCard = L.control({ position: 'bottomleft' });
        infoCard.onAdd = function() {
          const div = L.DomUtil.create('div', 'info-card');
          div.innerHTML = `
            <div class="bg-white p-2 rounded shadow-md text-xs">
              <div class="font-bold">Colis: ${trackingCode}</div>
              <div>Mise à jour: ${new Date(events[0].timestamp).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'short',
                hour: '2-digit', 
                minute: '2-digit'
              })}</div>
            </div>
          `;
          return div;
        };
        infoCard.addTo(map);
        
      } catch (error) {
        console.error("Erreur lors de l'initialisation de la carte", error);
        setMapError(true);
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
  }, [events, mapType, trackingCode, locatedEvents]);
  
  // Helper functions
  const getEventTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'pickup': 'Pris en charge',
      'transit': 'En transit',
      'customs': 'Contrôle douanier',
      'delivery': 'Livré',
      'delay': 'Retardé',
      'location': 'Mise à jour de position'
    };
    
    return labels[type] || 'Mise à jour';
  };
  
  const getEventColor = (type: string): string => {
    const colors: Record<string, string> = {
      'pickup': 'bg-purple-500',
      'transit': 'bg-blue-500',
      'customs': 'bg-amber-500',
      'delivery': 'bg-green-500',
      'delay': 'bg-orange-500',
      'location': 'bg-gray-500'
    };
    
    return colors[type] || 'bg-gray-400';
  };
  
  // Gérer le changement de type de carte
  const handleMapTypeChange = (value: string) => {
    setMapType(value);
  };

  if (mapError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Impossible d'afficher la carte</h3>
        <p className="text-muted-foreground text-center mb-4">
          Une erreur s'est produite lors du chargement de la carte. Veuillez réessayer plus tard.
        </p>
        <Button onClick={() => setMapError(false)}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="absolute top-2 right-2 z-10">
        <Tabs value={mapType} onValueChange={handleMapTypeChange}>
          <TabsList className="bg-white bg-opacity-90">
            <TabsTrigger value="roadmap">Carte</TabsTrigger>
            <TabsTrigger value="satellite">Satellite</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="absolute top-2 left-2 z-10">
        <Card className="bg-white bg-opacity-90 p-2 text-xs">
          <div className="flex items-center gap-1 mb-1">
            <Package className="h-3 w-3" />
            <span className="font-medium">Suivi du colis: {trackingCode}</span>
          </div>
          <div className="text-muted-foreground">
            {events.length} points de suivi
          </div>
        </Card>
      </div>
      
      <div 
        ref={mapRef} 
        className="relative w-full h-full bg-gray-100 overflow-hidden"
      >
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Chargement de la carte...</p>
          </div>
        )}
      </div>
      
      {events.length > 0 && (
        <div className="absolute bottom-2 right-2 z-10">
          <div className="flex flex-col gap-1">
            <Button size="sm" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span className="text-xs">Confirmer réception</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentMap;
