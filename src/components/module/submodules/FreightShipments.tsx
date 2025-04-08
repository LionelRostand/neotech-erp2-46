
import React, { useState, useEffect } from 'react';
import { Badge, BadgeCheck, User, Search, Plus, Printer, Download, Loader2 } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import ShipmentList from './freight/ShipmentList';
import NewShipmentForm from './freight/NewShipmentForm';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

const FreightShipments: React.FC = () => {
  // State pour contrôler le formulaire de nouvelle expédition
  const [showNewShipmentForm, setShowNewShipmentForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    ongoing: 0,
    delivered: 0,
    pending: 0,
    carriers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Charger les statistiques depuis Firebase
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Récupérer toutes les expéditions
        const shipmentsRef = collection(db, COLLECTIONS.FREIGHT.SHIPMENTS);
        const shipmentsSnapshot = await getDocs(shipmentsRef);
        
        // Calculer les statistiques
        let ongoing = 0;
        let delivered = 0;
        let pending = 0;
        const carrierIds = new Set();
        
        shipmentsSnapshot.forEach(doc => {
          const shipment = doc.data();
          
          // Compter par statut
          if (shipment.status === 'delivered') {
            delivered++;
          } else if (['confirmed', 'in_transit'].includes(shipment.status)) {
            ongoing++;
          } else if (['draft', 'delayed'].includes(shipment.status)) {
            pending++;
          }
          
          // Ajouter l'ID du transporteur à l'ensemble (pour éliminer les doublons)
          if (shipment.carrier) {
            carrierIds.add(shipment.carrier);
          }
        });
        
        // Mettre à jour les statistiques
        setStats({
          ongoing,
          delivered,
          pending,
          carriers: carrierIds.size
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const handleExport = () => {
    toast({
      title: "Export lancé",
      description: "Le fichier d'export sera bientôt disponible au téléchargement.",
    });
  };
  
  const handlePrint = () => {
    toast({
      title: "Impression en cours",
      description: "Préparation des documents pour impression...",
    });
    
    // Simuler une impression après un délai
    setTimeout(() => {
      toast({
        title: "Prêt à imprimer",
        description: "Les documents sont prêts pour l'impression.",
      });
      window.print();
    }, 1500);
  };

  // Générer les données des StatCards
  const statsData = [
    {
      title: "Expéditions",
      value: String(stats.ongoing),
      icon: <Badge className="h-8 w-8 text-neotech-primary" />,
      description: "Expéditions en cours"
    },
    {
      title: "Livraisons",
      value: String(stats.delivered),
      icon: <BadgeCheck className="h-8 w-8 text-green-500" />,
      description: "Livraisons effectuées ce mois"
    },
    {
      title: "En attente",
      value: String(stats.pending),
      icon: <Badge className="h-8 w-8 text-amber-500" />,
      description: "Expéditions en attente"
    },
    {
      title: "Transporteurs",
      value: String(stats.carriers),
      icon: <User className="h-8 w-8 text-blue-500" />,
      description: "Transporteurs actifs"
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-8 w-1/2 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 w-1/4 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : (
          statsData.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
            />
          ))
        )}
      </div>

      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Gestion des Expéditions</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            <Button onClick={() => setShowNewShipmentForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Expédition
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="ongoing">En cours</TabsTrigger>
              <TabsTrigger value="delivered">Livrées</TabsTrigger>
              <TabsTrigger value="delayed">En retard</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="all" className="mt-2">
            <ShipmentList filter="all" />
          </TabsContent>
          <TabsContent value="ongoing" className="mt-2">
            <ShipmentList filter="ongoing" />
          </TabsContent>
          <TabsContent value="delivered" className="mt-2">
            <ShipmentList filter="delivered" />
          </TabsContent>
          <TabsContent value="delayed" className="mt-2">
            <ShipmentList filter="delayed" />
          </TabsContent>
        </Tabs>
      </div>

      {showNewShipmentForm && (
        <NewShipmentForm 
          isOpen={showNewShipmentForm}
          onClose={() => setShowNewShipmentForm(false)}
        />
      )}
    </>
  );
};

export default FreightShipments;
