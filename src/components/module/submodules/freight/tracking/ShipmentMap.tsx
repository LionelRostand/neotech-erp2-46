
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shipment, GeoLocation, TrackingEvent } from '@/types/freight';
import { MapPin, AlertTriangle } from 'lucide-react';
import { fetchFreightCollectionData } from '@/hooks/fetchFreightCollectionData';
import { useToast } from '@/hooks/use-toast';
import 'leaflet/dist/leaflet.css';

interface ShipmentMapProps {
  shipmentId?: string;
  height?: string;
}

// Coordonnées de secours si nous n'avons pas de données
const DEFAULT_COORDS = {
  latitude: 48.856614,
  longitude: 2.3522219,
};

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipmentId, height = '400px' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapToken, setMapToken] = useState<string>('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Vérifier le token de carte
  useEffect(() => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapToken(storedToken);
    } else {
      setError("Configuration de carte manquante");
    }
  }, []);

  // Charger les données d'expédition si un ID est fourni
  useEffect(() => {
    if (!shipmentId) {
      setIsLoading(false);
      return;
    }

    const loadShipmentData = async () => {
      try {
        setIsLoading(true);
        
        // Charger l'expédition
        const shipments = await fetchFreightCollectionData<Shipment>('SHIPMENTS');
        const foundShipment = shipments.find(s => s.id === shipmentId);
        
        if (foundShipment) {
          setShipment(foundShipment);
          
          // Si l'expédition a un numéro de suivi, charger les événements de suivi
          if (foundShipment.trackingNumber) {
            const trackingEvents = await fetchFreightCollectionData<TrackingEvent>('TRACKING_EVENTS');
            const relatedEvents = trackingEvents.filter(e => 
              e.packageId === foundShipment.trackingNumber || 
              e.packageId === foundShipment.id
            );
            
            setEvents(relatedEvents);
          }
        } else {
          setError("Expédition non trouvée");
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données de l\'expédition:', err);
        setError("Erreur lors du chargement des données");
        setIsLoading(false);
      }
    };
    
    loadShipmentData();
  }, [shipmentId]);

  // Initialiser la carte une fois que nous avons les données
  useEffect(() => {
    if (!mapRef.current || !mapToken || isLoading) return;
    
    const initMap = async () => {
      try {
        // Import dynamique de Leaflet
        const L = await import('leaflet');
        
        // Créer la carte
        const map = L.map(mapRef.current).setView([DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude], 5);
        
        // Ajouter les tuiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);
        
        const markers: L.Marker[] = [];
        
        // Si nous avons des événements avec des localisations, les afficher sur la carte
        if (events.length > 0) {
          const eventsWithLocation = events.filter(event => event.location);
          
          eventsWithLocation.forEach(event => {
            if (event.location) {
              const { latitude, longitude } = event.location;
              
              const marker = L.marker([latitude, longitude]).addTo(map);
              
              // Créer un contenu de popup
              const popupContent = `
                <div class="p-2">
                  <h3 class="font-bold">${formatEventStatus(event.status)}</h3>
                  <p class="text-sm">${event.description}</p>
                  <p class="text-xs text-gray-500">${new Date(event.timestamp).toLocaleString('fr-FR')}</p>
                </div>
              `;
              
              marker.bindPopup(popupContent);
              markers.push(marker);
            }
          });
          
          // Si nous avons des marqueurs, ajuster la vue pour les montrer tous
          if (markers.length > 0) {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.1));
          }
        } 
        // Sinon, si nous avons un expédition avec origine et destination, afficher ces points
        else if (shipment) {
          // Nous utiliserions normalement un service de géocodage pour obtenir les coordonnées
          // Pour cette démo, nous utilisons des coordonnées factices
          const originCoords = { lat: 48.856614, lng: 2.3522219 }; // Paris
          const destCoords = { lat: 40.712776, lng: -74.005974 }; // New York
          
          // Marqueur d'origine
          const originMarker = L.marker(originCoords).addTo(map);
          originMarker.bindPopup(`<b>Origine</b><br>${shipment.origin}`);
          markers.push(originMarker);
          
          // Marqueur de destination
          const destMarker = L.marker(destCoords).addTo(map);
          destMarker.bindPopup(`<b>Destination</b><br>${shipment.destination}`);
          markers.push(destMarker);
          
          // Tracer une ligne entre les deux
          L.polyline([originCoords, destCoords], { color: 'blue', dashArray: '5, 5' }).addTo(map);
          
          // Ajuster la vue
          const group = L.featureGroup(markers);
          map.fitBounds(group.getBounds().pad(0.1));
        }
        
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte', error);
        setError("Erreur lors de l'initialisation de la carte");
      }
    };
    
    initMap();
  }, [mapToken, isLoading, events, shipment]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center" style={{ height }}>
          <p className="text-muted-foreground">Chargement de la carte...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col justify-center items-center" style={{ height }}>
          <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
          <p className="text-amber-800">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {shipment ? `Suivi de l'expédition ${shipment.reference}` : 'Carte de suivi'}
        </CardTitle>
        {shipment && (
          <CardDescription>
            {shipment.origin} → {shipment.destination}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        <div ref={mapRef} style={{ height, width: '100%' }} className="rounded-md overflow-hidden"></div>
      </CardContent>
    </Card>
  );
};

// Utilitaire pour formater le statut d'un événement
function formatEventStatus(status: string): string {
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
}

export default ShipmentMap;
