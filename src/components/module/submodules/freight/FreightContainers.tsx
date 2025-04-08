
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Container, Search, Plus, Filter, Download, Ship } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/StatCard';
import ContainerFormDialog from './ContainerFormDialog';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface FreightContainer {
  id: string;
  number: string;
  type: string;
  size: string;
  status: 'empty' | 'loading' | 'loaded' | 'in_transit' | 'delivered' | 'returned';
  carrier?: string;
  carrierName?: string;
  shipmentId?: string;
  origin?: string;
  destination?: string;
  departureDate?: string;
  arrivalDate?: string;
  lastUpdated: string;
}

const FreightContainers: React.FC = () => {
  const [containers, setContainers] = useState<FreightContainer[]>([]);
  const [filteredContainers, setFilteredContainers] = useState<FreightContainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showContainerForm, setShowContainerForm] = useState(false);
  const { toast } = useToast();

  // Fetch containers data
  const fetchContainers = async () => {
    try {
      setIsLoading(true);
      const containersRef = collection(db, COLLECTIONS.FREIGHT.CONTAINERS);
      const containersSnapshot = await getDocs(containersRef);
      
      const containersData = containersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastUpdated: doc.data().updatedAt || doc.data().createdAt || new Date().toISOString()
      } as FreightContainer));
      
      setContainers(containersData);
      setFilteredContainers(containersData);
      setIsLoading(false);
      console.log('Containers loaded:', containersData.length);
    } catch (error) {
      console.error("Error loading containers:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les conteneurs. Veuillez réessayer.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchContainers();
  }, [toast]);

  // Filter containers based on search term and status filter
  useEffect(() => {
    if (!containers) return;
    
    let filtered = [...containers];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(container => 
        container.number.toLowerCase().includes(term) || 
        container.type.toLowerCase().includes(term) ||
        (container.carrierName && container.carrierName.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(container => container.status === statusFilter);
    }
    
    setFilteredContainers(filtered);
  }, [containers, searchTerm, statusFilter]);

  const handleAddContainer = () => {
    setShowContainerForm(true);
  };

  const handleContainerAdded = () => {
    fetchContainers();
  };

  const handleExportData = () => {
    toast({
      title: "Export en cours",
      description: "L'export des données sera disponible prochainement.",
    });
  };

  const getContainerStatusBadge = (status: string) => {
    const statusStyles = {
      empty: "bg-gray-100 text-gray-800",
      loading: "bg-blue-100 text-blue-800",
      loaded: "bg-purple-100 text-purple-800",
      in_transit: "bg-amber-100 text-amber-800",
      delivered: "bg-green-100 text-green-800",
      returned: "bg-red-100 text-red-800"
    };
    
    const statusLabels = {
      empty: "Vide",
      loading: "En chargement",
      loaded: "Chargé",
      in_transit: "En transit",
      delivered: "Livré",
      returned: "Retourné"
    };

    const style = statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800";
    const label = statusLabels[status as keyof typeof statusLabels] || status;

    return (
      <Badge variant="outline" className={`${style} border-none px-2 py-1`}>
        {label}
      </Badge>
    );
  };

  const getContainerTypeIcon = (type: string) => {
    return <Container className="h-4 w-4 mr-2" />;
  };

  // Prepare counts for stats cards
  const getContainerCountByStatus = (status: string) => {
    if (!containers) return 0;
    return containers.filter(container => container.status === status).length;
  };

  const statsData = [
    {
      title: "Total",
      value: containers?.length.toString() || "0",
      icon: <Container className="h-8 w-8 text-primary" />,
      description: "Conteneurs enregistrés"
    },
    {
      title: "En Transit",
      value: getContainerCountByStatus('in_transit').toString(),
      icon: <Ship className="h-8 w-8 text-amber-500" />,
      description: "Conteneurs en cours de transport"
    },
    {
      title: "Livrés",
      value: getContainerCountByStatus('delivered').toString(),
      icon: <Container className="h-8 w-8 text-green-500" />,
      description: "Conteneurs livrés"
    },
    {
      title: "Vides",
      value: getContainerCountByStatus('empty').toString(),
      icon: <Container className="h-8 w-8 text-gray-500" />,
      description: "Conteneurs vides disponibles"
    }
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Chargement des conteneurs...</div>;
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

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Gestion des Conteneurs</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button onClick={handleAddContainer}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Conteneur
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un conteneur..."
              className="pl-8 w-full lg:w-[350px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs 
            value={statusFilter} 
            onValueChange={setStatusFilter}
            className="w-full lg:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="in_transit">En transit</TabsTrigger>
              <TabsTrigger value="loading">En chargement</TabsTrigger>
              <TabsTrigger value="loaded">Chargés</TabsTrigger>
              <TabsTrigger value="delivered">Livrés</TabsTrigger>
              <TabsTrigger value="empty">Vides</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Transporteur</TableHead>
                <TableHead>Origine</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Départ</TableHead>
                <TableHead>Arrivée</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContainers.length > 0 ? (
                filteredContainers.map((container) => (
                  <TableRow key={container.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{container.number}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getContainerTypeIcon(container.type)}
                        {container.type}
                      </div>
                    </TableCell>
                    <TableCell>{container.size}</TableCell>
                    <TableCell>{getContainerStatusBadge(container.status)}</TableCell>
                    <TableCell>{container.carrierName || '-'}</TableCell>
                    <TableCell>{container.origin || '-'}</TableCell>
                    <TableCell>{container.destination || '-'}</TableCell>
                    <TableCell>{formatDate(container.departureDate)}</TableCell>
                    <TableCell>{formatDate(container.arrivalDate)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                    Aucun conteneur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {showContainerForm && (
        <ContainerFormDialog 
          isOpen={showContainerForm} 
          onClose={() => setShowContainerForm(false)}
          onSave={handleContainerAdded}
        />
      )}
    </div>
  );
};

export default FreightContainers;
