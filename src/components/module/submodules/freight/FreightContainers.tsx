import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/StatusBadge';
import { Search, Plus, Package, Truck, CheckCircle } from 'lucide-react';
import { COLLECTIONS } from '@/lib/firebase-collections';
import ContainerFormDialog from './ContainerFormDialog';
import ContainerDetailsDialog from './ContainerDetailsDialog';
import { fetchFreightCollectionData } from '@/hooks/fetchFreightCollectionData';
import { FirebaseErrorAlert } from './components/FirebaseErrorAlert';
import StatCard from '@/components/StatCard';

interface Container {
  id: string;
  number: string;
  type: string;
  size: string;
  status: string;
  carrierName: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
}

const FreightContainers: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [filteredContainers, setFilteredContainers] = useState<Container[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchContainers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const containersData = await fetchFreightCollectionData<Container>('CONTAINERS');
      
      setContainers(containersData);
      setFilteredContainers(containersData);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading containers:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContainers(containers);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = containers.filter(container => 
        container.number.toLowerCase().includes(term) || 
        container.destination.toLowerCase().includes(term) ||
        container.origin.toLowerCase().includes(term) ||
        container.carrierName?.toLowerCase().includes(term)
      );
      setFilteredContainers(filtered);
    }
  }, [searchTerm, containers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddContainer = () => {
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleContainerClick = (container: Container) => {
    setSelectedContainer(container);
  };

  const handleCloseDetails = () => {
    setSelectedContainer(null);
  };

  const getStatusBadgeVariant = (status: string): "success" | "warning" | "danger" => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'in_transit':
      case 'loading':
        return 'warning';
      default:
        return 'danger';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Non spécifié";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'empty': return 'Vide';
      case 'loading': return 'En chargement';
      case 'loaded': return 'Chargé';
      case 'in_transit': return 'En transit';
      case 'delivered': return 'Livré';
      case 'returned': return 'Retourné';
      default: return status;
    }
  };

  const retryFetch = () => {
    fetchContainers();
  };

  if (error) {
    return (
      <div className="p-6">
        <FirebaseErrorAlert 
          error={error} 
          onRetry={retryFetch} 
          className="mb-4"
        />
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Gestion des Conteneurs</h2>
            <Button onClick={handleAddContainer}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Conteneur
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex justify-center p-12">Chargement des conteneurs...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        <StatCard 
          title="Total Conteneurs" 
          value={containers.length.toString()} 
          icon={<Package className="h-5 w-5 text-gray-500" />} 
          description="Nombre total de conteneurs" 
        />
        <StatCard 
          title="En Transit" 
          value={containers.filter(c => c.status === 'in_transit').length.toString()} 
          icon={<Truck className="h-5 w-5 text-gray-500" />} 
          description="Conteneurs actuellement en transit" 
        />
        <StatCard 
          title="Livrés ce mois" 
          value={containers.filter(c => c.status === 'delivered').length.toString()} 
          icon={<CheckCircle className="h-5 w-5 text-gray-500" />} 
          description="Conteneurs livrés ce mois-ci" 
        />
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold">Gestion des Conteneurs</h2>
            
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8 w-full md:w-[260px]"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <Button onClick={handleAddContainer}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Conteneur
              </Button>
            </div>
          </div>
          
          {filteredContainers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun conteneur trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Transporteur</TableHead>
                    <TableHead>Origine</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Départ</TableHead>
                    <TableHead>Arrivée</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContainers.map((container) => (
                    <TableRow 
                      key={container.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleContainerClick(container)}
                    >
                      <TableCell className="font-medium">{container.number}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{container.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={getStatusBadgeVariant(container.status)}>
                          {getStatusText(container.status)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{container.carrierName || "Non spécifié"}</TableCell>
                      <TableCell>{container.origin || "Non spécifié"}</TableCell>
                      <TableCell>{container.destination || "Non spécifié"}</TableCell>
                      <TableCell>{formatDate(container.departureDate)}</TableCell>
                      <TableCell>{formatDate(container.arrivalDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Container Dialog */}
      <ContainerFormDialog 
        isOpen={showAddForm} 
        onClose={handleCloseForm} 
        onSave={fetchContainers}
      />
      
      {/* Container Details Dialog */}
      {selectedContainer && (
        <ContainerDetailsDialog 
          isOpen={Boolean(selectedContainer)} 
          onClose={handleCloseDetails} 
          container={selectedContainer} 
        />
      )}
    </div>
  );
};

export default FreightContainers;
