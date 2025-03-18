
import React, { useEffect, useState } from 'react';
import { Package, TrackingEvent, PackageStatus } from '@/types/freight';
import { getPackageTrackingEvents, formatPackageStatus, getStatusColor, getLatestLocationFromEvents, getLatestEvent } from './mockTrackingData';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Truck, Calendar, Info, MapPin, AlertTriangle, Clock } from 'lucide-react';
import TrackingTimeline from './TrackingTimeline';
import MapPreview from './MapPreview';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationSettings from './NotificationSettings';
import PackageTrackingMap from './PackageTrackingMap';

interface TrackingDetailsProps {
  packageData: Package;
  onBack: () => void;
}

const TrackingDetails: React.FC<TrackingDetailsProps> = ({ packageData, onBack }) => {
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrackingEvents = async () => {
      try {
        // Simulating API call with setTimeout
        setTimeout(() => {
          const events = getPackageTrackingEvents(packageData.id);
          setTrackingEvents(events);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements de tracking:", error);
        setIsLoading(false);
      }
    };

    fetchTrackingEvents();
  }, [packageData.id]);

  const renderStatusBadge = (status: string) => {
    const colorMap: Record<string, string> = {
      delivered: "bg-green-100 text-green-800",
      shipped: "bg-blue-100 text-blue-800",
      ready: "bg-purple-100 text-purple-800",
      draft: "bg-gray-100 text-gray-800",
      returned: "bg-amber-100 text-amber-800",
      lost: "bg-red-100 text-red-800",
      exception: "bg-red-100 text-red-800",
      delayed: "bg-amber-100 text-amber-800",
      in_transit: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      registered: "bg-gray-100 text-gray-800",
      out_for_delivery: "bg-teal-100 text-teal-800"
    };

    const color = colorMap[status] || "bg-gray-100 text-gray-800";

    return (
      <Badge variant="outline" className={`${color} border-none font-medium px-3 py-1`}>
        {formatPackageStatus(status)}
      </Badge>
    );
  };

  const latestEvent = getLatestEvent(trackingEvents);
  const latestLocation = getLatestLocationFromEvents(trackingEvents);

  // Vérifier si le statut du colis indique une anomalie
  const hasIssue = () => {
    const problemStatuses: string[] = ['returned', 'lost', 'exception', 'delayed'];
    return problemStatuses.includes(packageData.status as string);
  };
  
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      
      <Card className="bg-white border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{packageData.reference}</CardTitle>
          <CardDescription className="text-gray-500">
            Détails du suivi pour le colis #{packageData.id}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-gray-500" />
              <span className="font-semibold">Transporteur:</span>
              <span>{packageData.carrierName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="font-semibold">Date d'expédition:</span>
              <span>{format(parseISO(packageData.createdAt), 'dd MMMM yyyy', { locale: fr })}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-gray-500" />
              <span className="font-semibold">Statut:</span>
              <span>{renderStatusBadge(packageData.status)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="font-semibold">Livraison prévue:</span>
              <span>
                {packageData.createdAt ? format(new Date(new Date(packageData.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000), 'dd MMMM yyyy', { locale: fr }) : 'Non disponible'}
              </span>
            </div>
          </div>
          
          {hasIssue() && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-800">
                Attention: Ce colis rencontre un problème. Veuillez contacter le service client pour plus d'informations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Chronologie</TabsTrigger>
          <TabsTrigger value="map">Carte</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="space-y-4">
          {isLoading ? (
            <p>Chargement de la chronologie...</p>
          ) : (
            <TrackingTimeline events={trackingEvents} />
          )}
        </TabsContent>
        
        <TabsContent value="map">
          {latestLocation ? (
            <MapPreview location={latestLocation} className="h-[200px]" />
          ) : (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              <p className="text-amber-800">Aucune information de localisation disponible pour ce colis.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings packageId={packageData.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrackingDetails;
