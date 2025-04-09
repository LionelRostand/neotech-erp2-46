
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import StatCard from '@/components/StatCard';
import { TrendingUp, TrendingDown, Timer, FileText, Ship, Truck, Container, Package } from 'lucide-react';
import { fetchFreightCollectionData } from '@/hooks/fetchFreightCollectionData';
import { Shipment, Package as FreightPackage, TrackingEvent } from '@/types/freight';
import { format, parseISO, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

const FreightDashboard: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [packages, setPackages] = useState<FreightPackage[]>([]);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const { toast } = useToast();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch shipments data
        const shipmentsData = await fetchFreightCollectionData<Shipment>('SHIPMENTS');
        setShipments(shipmentsData);
        
        // Fetch packages data
        const packagesData = await fetchFreightCollectionData<FreightPackage>('PACKAGES');
        setPackages(packagesData);
        
        // Fetch tracking events data
        const trackingEventsData = await fetchFreightCollectionData<TrackingEvent>('TRACKING_EVENTS');
        setTrackingEvents(trackingEventsData);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données du tableau de bord. Veuillez réessayer.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [toast]);

  // Calculer les statistiques clés
  const getActiveShipments = () => {
    return shipments?.filter(shipment => 
      ['confirmed', 'in_transit', 'delayed'].includes(shipment.status)
    ).length || 0;
  };
  
  const getDeliveredShipments = () => {
    return shipments?.filter(shipment => shipment.status === 'delivered').length || 0;
  };
  
  const getPendingShipments = () => {
    return shipments?.filter(shipment => shipment.status === 'draft').length || 0;
  };
  
  const getDelayedShipments = () => {
    return shipments?.filter(shipment => shipment.status === 'delayed').length || 0;
  };

  // Données pour les cartes de statistiques
  const statsData = [
    {
      title: "Expéditions actives",
      value: getActiveShipments().toString(),
      icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
      description: "Expéditions en cours de traitement"
    },
    {
      title: "Livrées",
      value: getDeliveredShipments().toString(),
      icon: <Ship className="h-8 w-8 text-green-500" />,
      description: "Expéditions livrées avec succès"
    },
    {
      title: "En attente",
      value: getPendingShipments().toString(),
      icon: <Timer className="h-8 w-8 text-amber-500" />,
      description: "Expéditions en attente de confirmation"
    },
    {
      title: "Retardées",
      value: getDelayedShipments().toString(),
      icon: <TrendingDown className="h-8 w-8 text-red-500" />,
      description: "Expéditions avec des retards"
    }
  ];

  // Préparation des données pour le graphique d'activité en fonction de la période sélectionnée
  const getActivityChartData = () => {
    if (!shipments || shipments.length === 0) {
      return {
        labels: ['Aucune donnée'],
        datasets: [
          {
            label: 'Expéditions',
            data: [0],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
          },
          {
            label: 'Livraisons',
            data: [0],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
          }
        ]
      };
    }

    const today = new Date();
    let startDate: Date;
    let dateFormat: string;
    let interval: { start: Date; end: Date };

    // Définir la plage de dates en fonction de la période sélectionnée
    switch (selectedPeriod) {
      case 'week':
        startDate = subDays(today, 6);
        dateFormat = 'EEE';
        interval = { start: startDate, end: today };
        break;
      case 'month':
        startDate = subDays(today, 30);
        dateFormat = 'dd MMM';
        interval = { start: startDate, end: today };
        break;
      case 'quarter':
        startDate = subDays(today, 90);
        dateFormat = 'MMM';
        interval = { start: startDate, end: today };
        break;
      case 'year':
        startDate = subDays(today, 365);
        dateFormat = 'MMM yyyy';
        interval = { start: startDate, end: today };
        break;
      default:
        startDate = subDays(today, 30);
        dateFormat = 'dd MMM';
        interval = { start: startDate, end: today };
    }

    // Générer tous les jours dans l'intervalle
    const days = eachDayOfInterval(interval);
    
    // Préparer les labels pour l'axe X
    const labels = days.map(day => format(day, dateFormat, { locale: fr }));
    
    // Compter les expéditions créées et livrées par jour
    const createdData = new Array(days.length).fill(0);
    const deliveredData = new Array(days.length).fill(0);
    
    shipments.forEach(shipment => {
      try {
        const createdDate = parseISO(shipment.createdAt);
        const dayIndex = days.findIndex(day => 
          createdDate.getDate() === day.getDate() && 
          createdDate.getMonth() === day.getMonth() &&
          createdDate.getFullYear() === day.getFullYear()
        );
        
        if (dayIndex !== -1) {
          createdData[dayIndex]++;
        }
        
        if (shipment.status === 'delivered' && shipment.actualDeliveryDate) {
          const deliveredDate = parseISO(shipment.actualDeliveryDate);
          const deliveredDayIndex = days.findIndex(day => 
            deliveredDate.getDate() === day.getDate() && 
            deliveredDate.getMonth() === day.getMonth() &&
            deliveredDate.getFullYear() === day.getFullYear()
          );
          
          if (deliveredDayIndex !== -1) {
            deliveredData[deliveredDayIndex]++;
          }
        }
      } catch (error) {
        console.error(`Error processing shipment date:`, error);
      }
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Expéditions créées',
          data: createdData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
        },
        {
          label: 'Livraisons',
          data: deliveredData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
        }
      ]
    };
  };

  // Préparation des données pour le graphique de types d'expédition
  const getShipmentTypesData = () => {
    if (!shipments || shipments.length === 0) {
      return {
        labels: ['Aucune donnée'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['rgba(209, 213, 219, 0.7)'],
            borderWidth: 1
          }
        ]
      };
    }
    
    // Compter les expéditions par type
    const typeCounts = {
      international: 0,
      export: 0,
      import: 0,
      local: 0
    };
    
    shipments.forEach(shipment => {
      if (shipment.shipmentType in typeCounts) {
        typeCounts[shipment.shipmentType as keyof typeof typeCounts]++;
      }
    });
    
    return {
      labels: ['International', 'Export', 'Import', 'Local'],
      datasets: [
        {
          data: [
            typeCounts.international,
            typeCounts.export,
            typeCounts.import,
            typeCounts.local
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(168, 85, 247, 0.7)',
            'rgba(234, 88, 12, 0.7)',
            'rgba(34, 197, 94, 0.7)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // Préparation des données pour le graphique de transporteurs
  const getCarriersData = () => {
    if (!shipments || shipments.length === 0) {
      return {
        labels: ['Aucun transporteur'],
        datasets: [
          {
            label: 'Nombre d\'expéditions',
            data: [0],
            backgroundColor: 'rgba(59, 130, 246, 0.7)'
          }
        ]
      };
    }
    
    // Compter les expéditions par transporteur
    const carrierCounts: Record<string, number> = {};
    
    shipments.forEach(shipment => {
      const carrierName = shipment.carrierName || 'Non spécifié';
      if (carrierCounts[carrierName]) {
        carrierCounts[carrierName]++;
      } else {
        carrierCounts[carrierName] = 1;
      }
    });
    
    // Trier par nombre d'expéditions et prendre les 5 premiers
    const sortedCarriers = Object.entries(carrierCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return {
      labels: sortedCarriers.map(([carrier]) => carrier),
      datasets: [
        {
          label: 'Nombre d\'expéditions',
          data: sortedCarriers.map(([_, count]) => count),
          backgroundColor: 'rgba(59, 130, 246, 0.7)'
        }
      ]
    };
  };

  // Obtenir les données de graphiques à partir des données réelles
  const activityData = getActivityChartData();
  const shipmentTypesData = getShipmentTypesData();
  const carriersData = getCarriersData();

  if (isLoading) {
    return <div className="flex justify-center p-12">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Activité d'expédition</CardTitle>
                <CardDescription>Nombre d'expéditions créées et livrées</CardDescription>
              </div>
              
              <Tabs defaultValue={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
                <TabsList>
                  <TabsTrigger value="week">Semaine</TabsTrigger>
                  <TabsTrigger value="month">Mois</TabsTrigger>
                  <TabsTrigger value="quarter">Trimestre</TabsTrigger>
                  <TabsTrigger value="year">Année</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <LineChart data={activityData} height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Types d'expédition</CardTitle>
            <CardDescription>Répartition par type d'expédition</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={shipmentTypesData} height={200} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transporteurs les plus actifs</CardTitle>
            <CardDescription>Nombre d'expéditions par transporteur</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={carriersData} height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expéditions récentes</CardTitle>
            <CardDescription>Dernières expéditions enregistrées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shipments.slice(0, 5).map((shipment) => (
                <div key={shipment.id} className="flex items-center space-x-4 p-2 hover:bg-muted rounded-md">
                  {shipment.shipmentType === 'international' || shipment.shipmentType === 'export' ? (
                    <Ship className="h-6 w-6 text-indigo-500" />
                  ) : (
                    <Truck className="h-6 w-6 text-blue-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{shipment.reference}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {shipment.origin} → {shipment.destination}
                    </p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${shipment.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                      ${shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' : ''}
                      ${shipment.status === 'delayed' ? 'bg-amber-100 text-amber-800' : ''}
                      ${shipment.status === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
                      ${shipment.status === 'confirmed' ? 'bg-purple-100 text-purple-800' : ''}
                      ${shipment.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {shipment.status}
                    </span>
                  </div>
                </div>
              ))}
              
              {shipments.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Aucune expédition récente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightDashboard;
