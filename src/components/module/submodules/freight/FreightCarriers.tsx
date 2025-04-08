
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash2, Search, Globe, Truck, Route } from 'lucide-react';
import { Carrier } from '@/types/freight';
import StatCard from '@/components/StatCard';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import CarrierFormDialog from './CarrierFormDialog';

const FreightCarriers: React.FC = () => {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCarriers, setFilteredCarriers] = useState<Carrier[]>([]);
  const [carrierTypeFilter, setCarrierTypeFilter] = useState('all');
  const [showNewCarrierForm, setShowNewCarrierForm] = useState(false);
  const { toast } = useToast();

  // Fetch carriers data
  const fetchCarriers = async () => {
    try {
      setIsLoading(true);
      const carriersRef = collection(db, COLLECTIONS.FREIGHT.CARRIERS);
      const carriersSnapshot = await getDocs(carriersRef);
      
      const carriersData = carriersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Carrier));
      
      setCarriers(carriersData);
      setFilteredCarriers(carriersData);
      setIsLoading(false);
      console.log('Carriers loaded:', carriersData.length);
    } catch (error) {
      console.error("Error loading carriers:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les transporteurs. Veuillez réessayer.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCarriers();
  }, [toast]);

  // Filter carriers based on search term and type filter
  useEffect(() => {
    if (!carriers) return;
    
    let filtered = [...carriers];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(carrier => 
        carrier.name.toLowerCase().includes(term) || 
        carrier.code.toLowerCase().includes(term) ||
        (carrier.contactName && carrier.contactName.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (carrierTypeFilter !== 'all') {
      filtered = filtered.filter(carrier => carrier.type === carrierTypeFilter);
    }
    
    setFilteredCarriers(filtered);
  }, [carriers, searchTerm, carrierTypeFilter]);

  const handleAddCarrier = () => {
    setShowNewCarrierForm(true);
  };

  const handleEditCarrier = (id: string) => {
    toast({
      title: "Fonction en développement",
      description: "La modification de transporteurs sera disponible prochainement.",
    });
  };

  const handleDeleteCarrier = (id: string) => {
    toast({
      title: "Fonction en développement",
      description: "La suppression de transporteurs sera disponible prochainement.",
    });
  };

  const getCarrierTypeCount = (type: string) => {
    if (!carriers) return 0;
    return carriers.filter(carrier => carrier.type === type).length;
  };

  const getCarrierTypeBadge = (type: string) => {
    switch (type) {
      case 'international':
        return <Badge className="bg-blue-500">{type}</Badge>;
      case 'national':
        return <Badge className="bg-green-500">{type}</Badge>;
      case 'local':
        return <Badge className="bg-amber-500">{type}</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Chargement des transporteurs...</div>;
  }

  const statsData = [
    {
      title: "Total",
      value: carriers?.length.toString() || "0",
      icon: <Truck className="h-8 w-8 text-blue-500" />,
      description: "Transporteurs enregistrés"
    },
    {
      title: "Internationaux",
      value: getCarrierTypeCount('international').toString(),
      icon: <Globe className="h-8 w-8 text-violet-500" />,
      description: "Transporteurs internationaux"
    },
    {
      title: "Nationaux",
      value: getCarrierTypeCount('national').toString(),
      icon: <Truck className="h-8 w-8 text-green-500" />,
      description: "Transporteurs nationaux"
    },
    {
      title: "Locaux",
      value: getCarrierTypeCount('local').toString(),
      icon: <Route className="h-8 w-8 text-amber-500" />,
      description: "Transporteurs locaux"
    }
  ];

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

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Gestion des Transporteurs</h2>
          <Button onClick={handleAddCarrier}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Transporteur
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un transporteur..."
              className="pl-8 w-full lg:w-[350px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs 
            value={carrierTypeFilter} 
            onValueChange={setCarrierTypeFilter}
            className="w-full lg:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="international">Internationaux</TabsTrigger>
              <TabsTrigger value="national">Nationaux</TabsTrigger>
              <TabsTrigger value="local">Locaux</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCarriers.length > 0 ? (
                filteredCarriers.map((carrier) => (
                  <TableRow key={carrier.id}>
                    <TableCell className="font-medium">{carrier.name}</TableCell>
                    <TableCell>{carrier.code}</TableCell>
                    <TableCell>{getCarrierTypeBadge(carrier.type)}</TableCell>
                    <TableCell>{carrier.contactName || '-'}</TableCell>
                    <TableCell>{carrier.contactEmail || '-'}</TableCell>
                    <TableCell>{carrier.contactPhone || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={carrier.active ? "default" : "outline"}>
                        {carrier.active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCarrier(carrier.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCarrier(carrier.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                    Aucun transporteur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {showNewCarrierForm && (
        <CarrierFormDialog 
          isOpen={showNewCarrierForm} 
          onClose={() => setShowNewCarrierForm(false)}
          onSuccess={fetchCarriers}
        />
      )}
    </div>
  );
};

export default FreightCarriers;
