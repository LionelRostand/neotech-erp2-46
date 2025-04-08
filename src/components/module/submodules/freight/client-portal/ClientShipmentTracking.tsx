
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Package, MapPin, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchFreightCollectionData } from '@/hooks/fetchFreightCollectionData';
import { Shipment, TrackingEvent } from '@/types/freight';
import { useToast } from '@/hooks/use-toast';
import PackageStatusBadge from '../tracking/components/PackageStatusBadge';
import TrackingTimeline from '../tracking/TrackingTimeline';
import ShipmentMap from '../tracking/ShipmentMap';

interface ClientShipmentTrackingProps {
  trackingNumber: string;
  isLoading: boolean;
}

const ClientShipmentTracking: React.FC<ClientShipmentTrackingProps> = ({ 
  trackingNumber,
  isLoading 
}) => {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [activeView, setActiveView] = useState<'map' | 'timeline'>('map');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!trackingNumber || isLoading) return;

    const searchShipment = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch shipments
        const shipments = await fetchFreightCollectionData<Shipment>('SHIPMENTS');
        
        // Find matching shipment by reference or tracking number
        const foundShipment = shipments.find(
          s => s.reference === trackingNumber || s.trackingNumber === trackingNumber
        );
        
        if (foundShipment) {
          setShipment(foundShipment);
          
          // Fetch tracking events
          const events = await fetchFreightCollectionData<TrackingEvent>('TRACKING_EVENTS');
          const shipmentEvents = events.filter(
            e => e.packageId === foundShipment.id || e.packageId === foundShipment.trackingNumber
          ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          
          setTrackingEvents(shipmentEvents);
        } else {
          setError("Aucune expédition trouvée avec cette référence");
          toast({
            title: "Expédition non trouvée",
            description: "Aucune expédition ne correspond à cette référence ou ce numéro de suivi.",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error("Error searching for shipment:", err);
        setError("Erreur lors de la recherche de l'expédition");
        toast({
          title: "Erreur de recherche",
          description: "Une erreur est survenue lors de la recherche. Veuillez réessayer.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    searchShipment();
  }, [trackingNumber, isLoading, toast]);

  if (loading || isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Recherche de votre expédition...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium">{error}</h3>
          <p className="text-muted-foreground">
            Veuillez vérifier le numéro de suivi ou la référence et réessayer.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!shipment) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Aucune expédition trouvée</h3>
          <p className="text-muted-foreground">
            Aucune expédition ne correspond à cette référence ou ce numéro de suivi.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Expédition {shipment.reference}</CardTitle>
            <CardDescription>
              Status: <PackageStatusBadge status={shipment.status} />
            </CardDescription>
          </div>
          <Package className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Origine</div>
            <div className="font-medium">{shipment.origin}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Destination</div>
            <div className="font-medium">{shipment.destination}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Date d'expédition</div>
            <div className="font-medium">{formatDate(shipment.scheduledDate)}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Transporteur</div>
            <div className="font-medium">{shipment.carrierName || "Non assigné"}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Type d'expédition</div>
            <div className="font-medium">{shipment.shipmentType}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Livraison estimée</div>
            <div className="font-medium">{formatDate(shipment.estimatedDeliveryDate)}</div>
          </div>
        </div>

        <Tabs defaultValue="map" onValueChange={(value) => setActiveView(value as 'map' | 'timeline')}>
          <TabsList className="mb-4">
            <TabsTrigger value="map">
              <MapPin className="mr-2 h-4 w-4" />
              Carte
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Chronologie
            </TabsTrigger>
          </TabsList>
          <TabsContent value="map">
            <div className="h-[400px]">
              <ShipmentMap shipmentId={shipment.id} />
            </div>
          </TabsContent>
          <TabsContent value="timeline">
            {trackingEvents.length > 0 ? (
              <TrackingTimeline events={trackingEvents} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Aucun événement de suivi</h3>
                <p className="text-muted-foreground">
                  Aucun événement de suivi n'a encore été enregistré pour cette expédition.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientShipmentTracking;
