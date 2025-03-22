
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Package, Truck, MapPin, Search, Clock, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockLocations } from './tracking/utils/locationUtils';
import ShipmentMap from './tracking/ShipmentMap';

const statusOptions = [
  { value: 'transit', label: 'En transit', color: 'blue' },
  { value: 'delivered', label: 'Livré', color: 'green' },
  { value: 'pending', label: 'En attente', color: 'yellow' },
  { value: 'issue', label: 'Problème', color: 'red' },
];

const eventTypes = {
  'pickup': { label: 'Pris en charge', icon: Package },
  'transit': { label: 'En transit', icon: Truck },
  'customs': { label: 'Contrôle douanier', icon: AlertCircle },
  'delivery': { label: 'Livré', icon: CheckCircle },
  'delay': { label: 'Retardé', icon: Clock },
  'location': { label: 'Mise à jour de position', icon: MapPin },
};

// Génération d'événements de suivi fictifs basés sur un code
const generateEvents = (trackingCode: string) => {
  const events = [
    {
      type: 'pickup',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Colis pris en charge par le transporteur',
      location: mockLocations[0]
    },
    {
      type: 'transit',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Colis en transit vers centre de tri',
      location: mockLocations[1]
    },
    {
      type: 'location',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Arrivé au centre de tri',
      location: mockLocations[2]
    }
  ];

  // Ajouter plus d'événements en fonction du code de suivi
  if (trackingCode.includes('1')) {
    events.push({
      type: 'customs',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'En attente de dédouanement',
      location: mockLocations[3]
    });
  }

  if (trackingCode.includes('2')) {
    events.push({
      type: 'delay',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      description: 'Retard de livraison dû aux conditions météorologiques',
      location: mockLocations[4]
    });
  }

  if (trackingCode.includes('3') || trackingCode.includes('0')) {
    events.push({
      type: 'delivery',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      description: 'Colis livré au destinataire',
      location: mockLocations[5]
    });
  }

  return events.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Déterminer le statut en fonction des événements
const determineStatus = (events: any[]) => {
  const eventTypes = events.map(e => e.type);
  
  if (eventTypes.includes('delivery')) return 'delivered';
  if (eventTypes.includes('delay')) return 'issue';
  if (eventTypes.includes('transit') || eventTypes.includes('customs')) return 'transit';
  return 'pending';
};

const FreightTracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const codeFromUrl = searchParams.get('code');
  
  const [trackingCode, setTrackingCode] = useState(codeFromUrl || '');
  const [inputCode, setInputCode] = useState(codeFromUrl || '');
  const [events, setEvents] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    if (trackingCode) {
      const generatedEvents = generateEvents(trackingCode);
      setEvents(generatedEvents);
      setStatus(determineStatus(generatedEvents));
    }
  }, [trackingCode]);

  const handleSearch = () => {
    setTrackingCode(inputCode);
    setSearchParams({ code: inputCode });
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    if (!statusOption) return null;

    return (
      <Badge 
        className={`bg-${statusOption.color}-100 text-${statusOption.color}-800 hover:bg-${statusOption.color}-100`}
      >
        {statusOption.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Suivi de colis</h2>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Rechercher un colis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 max-w-xl">
            <Input
              placeholder="Entrez votre code de suivi"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </CardContent>
      </Card>

      {trackingCode && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>
                  Colis {trackingCode} {status && getStatusBadge(status)}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="timeline">Chronologie</TabsTrigger>
                  <TabsTrigger value="map">Carte</TabsTrigger>
                  <TabsTrigger value="details">Détails</TabsTrigger>
                </TabsList>
                
                <TabsContent value="timeline" className="space-y-4 mt-4">
                  {events.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Aucune information de suivi disponible pour ce code.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="border rounded-md">
                      <div className="relative">
                        {events.map((event, idx) => {
                          const EventIcon = eventTypes[event.type as keyof typeof eventTypes]?.icon || Package;
                          return (
                            <div 
                              key={idx} 
                              className={`flex p-4 ${idx !== 0 ? 'border-t' : ''}`}
                            >
                              <div className="mr-4 mt-1">
                                <div className="rounded-full bg-gray-100 p-2">
                                  <EventIcon className="h-5 w-5 text-primary" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium">
                                    {eventTypes[event.type as keyof typeof eventTypes]?.label || 'Mise à jour'}
                                  </h4>
                                  <span className="text-sm text-muted-foreground">
                                    {formatDate(event.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  {event.description}
                                </p>
                                {event.location && (
                                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span>
                                      {event.location.address}, {event.location.city}, {event.location.country}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="map" className="mt-4">
                  <div className="border rounded-md overflow-hidden" style={{ height: '500px' }}>
                    <ShipmentMap 
                      events={events} 
                      trackingCode={trackingCode}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <h3 className="text-sm font-medium mb-2">Informations d'expédition</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Code de suivi:</dt>
                          <dd className="text-sm font-medium">{trackingCode}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Statut:</dt>
                          <dd>{getStatusBadge(status)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Date d'expédition:</dt>
                          <dd className="text-sm">
                            {events.length > 0 ? formatDate(events[events.length - 1].timestamp) : 'N/A'}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Dernière mise à jour:</dt>
                          <dd className="text-sm">
                            {events.length > 0 ? formatDate(events[0].timestamp) : 'N/A'}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="border rounded-md p-4">
                      <h3 className="text-sm font-medium mb-2">Détails du destinataire</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Nom:</dt>
                          <dd className="text-sm font-medium">Client ABC</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Adresse:</dt>
                          <dd className="text-sm">456 Rue du Commerce</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Ville:</dt>
                          <dd className="text-sm">Lyon, 69002</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Pays:</dt>
                          <dd className="text-sm">France</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default FreightTracking;
