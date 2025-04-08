
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, TrendingUp, Clock, Package } from 'lucide-react';
import { TrackingEvent, Package as FreightPackage } from '@/types/freight';
import { fetchFreightCollectionData } from '@/hooks/fetchFreightCollectionData';
import PackageTrackingMap from './tracking/PackageTrackingMap';
import TrackingTimeline from './tracking/TrackingTimeline';
import PackageStatusBadge from './tracking/components/PackageStatusBadge';

const FreightTracking: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [packages, setPackages] = useState<FreightPackage[]>([]);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<FreightPackage | null>(null);
  const [activeView, setActiveView] = useState<'map' | 'timeline'>('map');
  const { toast } = useToast();

  // Charger les packages pour la recherche
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const packagesData = await fetchFreightCollectionData<FreightPackage>('PACKAGES');
        setPackages(packagesData);
      } catch (error) {
        console.error("Error loading packages:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données de suivi. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    };
    
    loadPackages();
  }, [toast]);

  // Rechercher un package par tracking number ou référence
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Rechercher le package
      const matchedPackage = packages.find(
        p => p.trackingNumber === searchTerm || p.reference === searchTerm
      );
      
      if (matchedPackage) {
        setSelectedPackage(matchedPackage);
        
        // Charger les événements associés à ce package
        const events = await fetchFreightCollectionData<TrackingEvent>('TRACKING_EVENTS');
        const packageEvents = events.filter(e => e.packageId === matchedPackage.id);
        
        // Trier les événements par date (du plus récent au plus ancien)
        packageEvents.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setTrackingEvents(packageEvents);
        
        toast({
          title: "Colis trouvé",
          description: `Suivi du colis ${matchedPackage.reference} activé.`,
        });
      } else {
        setSelectedPackage(null);
        setTrackingEvents([]);
        
        toast({
          title: "Colis non trouvé",
          description: "Aucun colis ne correspond à cette référence ou ce numéro de suivi.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error searching package:", error);
      toast({
        title: "Erreur de recherche",
        description: "Une erreur est survenue lors de la recherche. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Suivi d'Expédition</CardTitle>
          <CardDescription>
            Entrez un numéro de suivi ou une référence pour suivre votre colis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Numéro de suivi ou référence..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !searchTerm.trim()}>
              {isSearching ? 'Recherche...' : 'Rechercher'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedPackage && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Colis {selectedPackage.reference}</CardTitle>
                <CardDescription>
                  Status: <PackageStatusBadge status={selectedPackage.status} />
                </CardDescription>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Type de colis</div>
                <div className="font-medium">{selectedPackage.packageType}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Poids</div>
                <div className="font-medium">{selectedPackage.weight} {selectedPackage.weightUnit}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Date de création</div>
                <div className="font-medium">{formatDate(selectedPackage.createdAt)}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Transporteur</div>
                <div className="font-medium">{selectedPackage.carrierName || "Non assigné"}</div>
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
                  <PackageTrackingMap 
                    initialEvents={trackingEvents}
                  />
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
                      Aucun événement de suivi n'a encore été enregistré pour ce colis.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {!selectedPackage && searchTerm.trim() && !isSearching && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Aucun résultat trouvé</h3>
            <p className="text-muted-foreground">
              Aucun colis ne correspond à cette référence ou ce numéro de suivi.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FreightTracking;
