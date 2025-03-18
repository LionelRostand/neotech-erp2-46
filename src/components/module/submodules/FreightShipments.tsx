
import React, { useState } from 'react';
import { Badge, BadgeCheck, User, Search, Plus, Printer, Download } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import ShipmentList from './freight/ShipmentList';
import NewShipmentForm from './freight/NewShipmentForm';
import { useToast } from '@/hooks/use-toast';

const FreightShipments: React.FC = () => {
  // State for controlling the new shipment dialog
  const [showNewShipmentForm, setShowNewShipmentForm] = useState(false);
  const { toast } = useToast();
  
  // Sample data for the stats cards
  const statsData = [
    {
      title: "Expéditions",
      value: "124",
      icon: <Badge className="h-8 w-8 text-neotech-primary" />,
      description: "Expéditions en cours"
    },
    {
      title: "Livraisons",
      value: "87",
      icon: <BadgeCheck className="h-8 w-8 text-green-500" />,
      description: "Livraisons effectuées ce mois"
    },
    {
      title: "En attente",
      value: "36",
      icon: <Badge className="h-8 w-8 text-amber-500" />,
      description: "Expéditions en attente"
    },
    {
      title: "Transporteurs",
      value: "12",
      icon: <User className="h-8 w-8 text-blue-500" />,
      description: "Transporteurs actifs"
    }
  ];

  const handleExport = () => {
    toast({
      title: "Export lancé",
      description: "Le fichier d'export sera bientôt disponible au téléchargement.",
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Gestion des Expéditions</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button variant="outline">
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
