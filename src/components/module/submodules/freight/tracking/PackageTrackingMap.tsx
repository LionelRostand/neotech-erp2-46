
import React, { useEffect, useRef, useState } from 'react';
import { TrackingEvent } from '@/types/freight';
import { formatPackageStatus } from './mockTrackingData';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, AlertTriangle, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PackageTrackingMapProps {
  onTrackingFound?: (events: TrackingEvent[]) => void;
  initialEvents?: TrackingEvent[];
}

const PackageTrackingMap: React.FC<PackageTrackingMapProps> = ({ 
  onTrackingFound,
  initialEvents
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);
  const [currentEvents, setCurrentEvents] = useState<TrackingEvent[]>(initialEvents || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapToken, setMapToken] = useState<string>('');
  const { toast } = useToast();
  const leafletMapRef = useRef<any>(null);

  // Check for stored map token
  useEffect(() => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapToken(storedToken);
    }
  }, []);

  // Initialize and update map when events change
  useEffect(() => {
    if (!mapRef.current || !mapToken || !currentEvents.length) return;
    
    const initializeMap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const L = await import('leaflet');
        
        // Initialize map if not already done
        if (!mapInitialized) {
          // Get the latest event with location
          const eventsWithLocation = currentEvents.filter(event => event.location);
          
          if (eventsWithLocation.length === 0) {
            setError("Aucune donnée de localisation disponible pour ce colis.");
            return;
          }
          
          // Use the most recent event with location
          const latestEvent = eventsWithLocation[0];
          const { latitude, longitude } = latestEvent.location!;
          
          // Clear any existing map
          if (leafletMapRef.current) {
            leafletMapRef.current.remove();
            leafletMapRef.current = null;
          }
          
          // Create new map
          const map = L.map(mapRef.current).setView([latitude, longitude], 8);
          leafletMapRef.current = map;
          
          // Add tile layer (using OpenStreetMap)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);
          
          // Add markers for all events with location
          eventsWithLocation.forEach(event => {
            if (event.location) {
              const { latitude, longitude, city, country } = event.location;
              const marker = L.marker([latitude, longitude]).addTo(map);
              
              // Create popup content
              const popupContent = `
                <div>
                  <h3 class="font-bold">${formatPackageStatus(event.status)}</h3>
                  <p>${city}, ${country}</p>
                  <p class="text-sm">${new Date(event.timestamp).toLocaleString('fr-FR')}</p>
                </div>
              `;
              
              marker.bindPopup(popupContent).openPopup();
            }
          });
          
          setMapInitialized(true);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        setError("Erreur lors de l'initialisation de la carte.");
      }
    };
    
    initializeMap();
  }, [currentEvents, mapToken, mapInitialized]);

  // Clean up map on component unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const handleTrack = async () => {
    if (!trackingNumber) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un numéro de référence.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real application, this would be an API call
      // Simulating API call with timeout
      setTimeout(() => {
        // Mock data - in a real app this would come from the API
        const mockEvents: TrackingEvent[] = [
          {
            id: "event1",
            packageId: "pkg1",
            timestamp: new Date().toISOString(),
            status: "in_transit",
            location: {
              latitude: 48.8566,
              longitude: 2.3522,
              address: "12 Rue de Rivoli",
              city: "Paris",
              country: "France",
              postalCode: "75001"
            },
            description: "Colis en transit à Paris",
            isNotified: true
          },
          {
            id: "event2",
            packageId: "pkg1",
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            status: "processing",
            location: {
              latitude: 51.5074,
              longitude: -0.1278,
              address: "10 Downing Street",
              city: "London",
              country: "United Kingdom",
              postalCode: "SW1A 2AA"
            },
            description: "Colis traité à Londres",
            isNotified: true
          }
        ];
        
        setCurrentEvents(mockEvents);
        if (onTrackingFound) {
          onTrackingFound(mockEvents);
        }
        
        // Reset map to reinitialize with new data
        setMapInitialized(false);
        
        toast({
          title: "Succès",
          description: "Colis trouvé et localisé sur la carte.",
        });
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error tracking package:", error);
      setError("Erreur lors du suivi du colis. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  if (!mapToken) {
    return (
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-medium">Configuration de la carte</h3>
          <p className="text-sm text-gray-600">
            Pour afficher les cartes, veuillez entrer votre token OpenStreetMap (ou créez un compte sur 
            <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline"> OpenStreetMap</a>).
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              value={mapToken}
              onChange={(e) => setMapToken(e.target.value)}
              placeholder="Entrez votre token OpenStreetMap"
            />
            <Button 
              onClick={() => {
                localStorage.setItem('mapbox_token', mapToken);
                toast({
                  title: "Succès",
                  description: "Token sauvegardé avec succès."
                });
              }}
            >
              Sauvegarder
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Entrez le numéro de référence"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <Button 
          onClick={handleTrack} 
          disabled={isLoading}
          className="whitespace-nowrap"
        >
          {isLoading ? "Recherche..." : "Suivre le colis"}
          <Search className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      {error && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
          <p className="text-amber-800">{error}</p>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="h-[400px] w-full bg-slate-100 rounded-md relative"
      >
        {!currentEvents.length && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="text-gray-500">Entrez un numéro de référence pour localiser votre colis</p>
            </div>
          </div>
        )}
      </div>
      
      {currentEvents.length > 0 && (
        <div className="text-sm">
          <p className="font-medium">Dernier statut: {formatPackageStatus(currentEvents[0].status)}</p>
          {currentEvents[0].location && (
            <p>
              Localisation: {currentEvents[0].location.city}, {currentEvents[0].location.country}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PackageTrackingMap;
