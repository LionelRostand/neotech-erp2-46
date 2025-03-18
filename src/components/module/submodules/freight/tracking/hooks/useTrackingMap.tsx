
import { useState, useEffect } from 'react';
import { TrackingEvent } from '@/types/freight';
import { useToast } from '@/hooks/use-toast';

export function useTrackingMap() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [currentEvents, setCurrentEvents] = useState<TrackingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapToken, setMapToken] = useState<string>('');
  const { toast } = useToast();

  // Check for stored map token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapToken(storedToken);
    }
  }, []);

  const handleTrack = async (trackingNumber: string) => {
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

  return {
    trackingNumber,
    setTrackingNumber,
    currentEvents,
    setCurrentEvents,
    isLoading,
    error,
    setError,
    mapToken,
    setMapToken,
    handleTrack
  };
}
