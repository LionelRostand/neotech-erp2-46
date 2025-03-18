
import React, { useEffect, useState } from 'react';
import { Package, TrackingEvent } from '@/types/freight';
import { getPackageTrackingEvents, formatPackageStatus, getStatusColor } from './mockTrackingData';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrackingTimeline from './TrackingTimeline';
import NotificationSettings from './NotificationSettings';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, FileText, MapPin, Printer, Share2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import QRCode from '../packages/QRCode';
import { useToast } from '@/hooks/use-toast';

interface TrackingDetailsProps {
  packageData: Package;
  onBack: () => void;
}

const TrackingDetails: React.FC<TrackingDetailsProps> = ({ packageData, onBack }) => {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate API call to get tracking events
    const fetchTrackingEvents = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      setTimeout(() => {
        const trackingEvents = getPackageTrackingEvents(packageData.id);
        setEvents(trackingEvents);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchTrackingEvents();
  }, [packageData.id]);
  
  const handleShare = () => {
    // In a real app, this would open a share dialog or copy link to clipboard
    const trackingLink = `https://example.com/tracking?number=${packageData.trackingNumber}`;
    
    // Simulate copying to clipboard
    navigator.clipboard.writeText(trackingLink).then(() => {
      toast({
        title: "Lien copié",
        description: "Lien de suivi copié dans le presse-papier",
      });
    });
  };
  
  // Calculate delivery progress based on events
  const calculateProgress = (): number => {
    if (!events.length) return 0;
    
    const statusWeights: {[key: string]: number} = {
      'registered': 10,
      'processing': 25,
      'in_transit': 50,
      'out_for_delivery': 80,
      'delivered': 100,
      'delayed': 50,
      'exception': 50,
      'returned': 90,
      'lost': 100,
    };
    
    // Get the last event's status
    const lastEvent = events[events.length - 1];
    return statusWeights[lastEvent.status] || 0;
  };

  // Vérifier si le statut du colis indique une anomalie
  const hasIssue = () => {
    return (
      packageData.status === 'returned' || 
      packageData.status === 'lost' || 
      packageData.status === 'draft' ||
      packageData.status === 'exception' ||
      packageData.status === 'delayed'
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" /> Partager
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Imprimer
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Colis {packageData.reference}</CardTitle>
              <CardDescription>
                Créé le {format(new Date(packageData.createdAt), 'dd MMMM yyyy', { locale: fr })}
              </CardDescription>
            </div>
            
            <StatusBadge status={getStatusColor(packageData.status)} className="text-sm">
              {formatPackageStatus(packageData.status)}
            </StatusBadge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Informations sur le colis</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">N° de suivi</p>
                    <p className="font-medium">{packageData.trackingNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Transporteur</p>
                    <p className="font-medium">{packageData.carrierName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Poids</p>
                    <p className="font-medium">{packageData.weight} {packageData.weightUnit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="font-medium">{packageData.packageType}</p>
                  </div>
                </div>
              </div>
              
              {isLoading ? (
                <div className="py-4">
                  <p className="text-sm text-gray-500 mb-2">Chargement du statut...</p>
                  <Progress value={45} className="h-2" />
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Progression de la livraison</h3>
                    <div className="mt-2">
                      <Progress value={calculateProgress()} className="h-2" />
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>Enregistré</span>
                        <span>En transit</span>
                        <span>Livré</span>
                      </div>
                    </div>
                  </div>
                  
                  {hasIssue() && (
                    <div className="flex items-start p-3 rounded-md bg-amber-50 border border-amber-200">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Attention</p>
                        <p className="text-sm text-amber-700">
                          {packageData.status === 'lost' 
                            ? 'Ce colis a été déclaré perdu. Veuillez contacter le service client pour plus d\'informations.'
                            : packageData.status === 'returned'
                            ? 'Ce colis a été retourné à l\'expéditeur.'
                            : packageData.status === 'delayed' || packageData.status === 'exception'
                            ? 'La livraison est retardée ou un problème est survenu. Nous nous excusons pour ce désagrément.'
                            : 'Ce colis est en attente de traitement.'}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="flex flex-col items-center justify-center">
              {packageData.trackingNumber && (
                <div className="text-center">
                  <QRCode value={packageData.trackingNumber} size={150} />
                  <p className="text-xs text-gray-500 mt-2">Scannez pour suivre</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">
            <MapPin className="mr-2 h-4 w-4" />
            Chronologie
          </TabsTrigger>
          <TabsTrigger value="documents" disabled={packageData.documents.length === 0}>
            <FileText className="mr-2 h-4 w-4" />
            Documents ({packageData.documents.length})
          </TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="mt-4">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center items-center py-8">
                  <p className="text-gray-500">Chargement des événements de suivi...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <TrackingTimeline events={events} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {packageData.documents.map((doc) => (
                  <div key={doc.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(doc.createdAt), 'dd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Télécharger
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <NotificationSettings packageId={packageData.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrackingDetails;
