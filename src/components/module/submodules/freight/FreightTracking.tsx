
import React, { useState, useEffect } from 'react';
import { MapPin, Package, Search, Bell, ChevronDown } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Package as PackageType, TrackingEvent } from '@/types/freight';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import TrackingSearch from './tracking/TrackingSearch';
import TrackingHistory from './tracking/TrackingHistory';
import TrackingDetails from './tracking/TrackingDetails';
import PackageTrackingMap from './tracking/PackageTrackingMap';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './tracking/PackageTrackingStyles.css';

const FreightTracking: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  
  // Sample data for the stats cards
  const statsData = [
    {
      title: "Colis en transit",
      value: "48",
      icon: <Package className="h-8 w-8 text-blue-500" />,
      description: "Colis actuellement en livraison"
    },
    {
      title: "Suivis actifs",
      value: "134",
      icon: <MapPin className="h-8 w-8 text-green-500" />,
      description: "Colis suivis ce mois"
    },
    {
      title: "Notifications",
      value: "217",
      icon: <Bell className="h-8 w-8 text-amber-500" />,
      description: "Alertes envoyées aux clients"
    },
    {
      title: "Recherches",
      value: "512",
      icon: <Search className="h-8 w-8 text-purple-500" />,
      description: "Requêtes de suivi traitées"
    }
  ];
  
  const handlePackageFound = (packageData: PackageType) => {
    setSelectedPackage(packageData);
  };
  
  const handleTrackingFound = (events: TrackingEvent[]) => {
    setTrackingEvents(events);
  };
  
  const handleBack = () => {
    setSelectedPackage(null);
  };
  
  return (
    <div className="space-y-8">
      {/* Statistics overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="bg-white rounded-lg shadow p-6">
        {selectedPackage ? (
          <TrackingDetails 
            packageData={selectedPackage} 
            onBack={handleBack} 
          />
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Suivi de colis</h2>
              <p className="text-gray-500">
                Suivez l'état et la localisation de vos colis en temps réel
              </p>
            </div>
            
            <div className="pb-4">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-blue-800">Rechercher un colis</CardTitle>
                  <CardDescription className="text-blue-700">
                    Entrez le numéro de suivi pour connaître l'état de votre colis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TrackingSearch onPackageFound={handlePackageFound} />
                </CardContent>
              </Card>
            </div>
            
            <div className="pb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Suivi GPS en temps réel</CardTitle>
                  <CardDescription>
                    Visualisez la position actuelle et l'historique de déplacement de votre colis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PackageTrackingMap 
                    onTrackingFound={handleTrackingFound}
                    initialEvents={trackingEvents}
                  />
                </CardContent>
              </Card>
            </div>
            
            <Collapsible open={isGuideOpen} onOpenChange={setIsGuideOpen} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Conseils pour le suivi</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-2">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-sm">
                        Pour suivre efficacement vos colis, voici quelques conseils :
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Conservez toujours votre numéro de suivi jusqu'à la livraison complète</li>
                        <li>Activez les notifications par email pour être informé de chaque changement d'état</li>
                        <li>Vérifiez que les informations de livraison sont correctes et à jour</li>
                        <li>En cas de problème, contactez directement le transporteur avec votre numéro de suivi</li>
                        <li>Conservez les photos de preuve de livraison si disponibles</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
            
            <Tabs defaultValue="history" className="mt-6">
              <TabsList>
                <TabsTrigger value="history">Historique de suivi</TabsTrigger>
                <TabsTrigger value="carriers">Transporteurs pris en charge</TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="mt-4">
                <TrackingHistory onPackageSelect={handlePackageFound} />
              </TabsContent>
              <TabsContent value="carriers" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Transporteurs pris en charge</CardTitle>
                    <CardDescription>
                      Notre système de suivi est compatible avec plus de 35 transporteurs internationaux
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {['DHL', 'FedEx', 'UPS', 'TNT', 'La Poste', 'Chronopost', 'GLS', 'DPD', 'Colissimo', 'Mondial Relay', 'Amazon Logistics', 'USPS'].map(carrier => (
                        <div key={carrier} className="p-4 border rounded-md text-center">
                          <p className="font-medium">{carrier}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreightTracking;
