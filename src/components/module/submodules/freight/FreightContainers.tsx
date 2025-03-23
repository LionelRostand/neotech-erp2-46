
import React, { useState } from 'react';
import { Search, Filter, Plus, ArrowUpDown, Eye, Truck, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import StatusBadge from '@/components/StatusBadge';
import { toast } from 'sonner';

const FreightContainers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Sample data
  const containers = [
    { 
      id: 'CONT001', 
      number: 'CON12345678', 
      type: '40ft High Cube', 
      status: 'in_transit', 
      location: 'Marseille, FR', 
      destination: 'Lyon, FR',
      client: 'MariTrans SAS',
      departure: '2023-10-15',
      arrival: '2023-10-18'
    },
    { 
      id: 'CONT002', 
      number: 'CON23456789', 
      type: '20ft Standard', 
      status: 'delivered', 
      location: 'Paris, FR', 
      destination: 'Paris, FR',
      client: 'Logistique Express',
      departure: '2023-10-10',
      arrival: '2023-10-12'
    },
    { 
      id: 'CONT003', 
      number: 'CON34567890', 
      type: '40ft Refrigerated', 
      status: 'loading', 
      location: 'Le Havre, FR', 
      destination: 'Bordeaux, FR',
      client: 'FruitFresh SA',
      departure: '2023-10-18',
      arrival: '2023-10-20'
    },
    { 
      id: 'CONT004', 
      number: 'CON45678901', 
      type: '20ft Open Top', 
      status: 'customs', 
      location: 'Calais, FR', 
      destination: 'Lille, FR',
      client: 'BuildAll Construction',
      departure: '2023-10-14',
      arrival: '2023-10-16'
    },
    { 
      id: 'CONT005', 
      number: 'CON56789012', 
      type: '40ft Flat Rack', 
      status: 'ready', 
      location: 'Toulouse, FR', 
      destination: 'Montpellier, FR',
      client: 'MachineWorks Inc',
      departure: '2023-10-19',
      arrival: '2023-10-21'
    },
  ];
  
  const getStatusColor = (status: string): "success" | "warning" | "danger" => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'in_transit':
      case 'loading':
      case 'ready':
        return 'warning';
      case 'customs':
      default:
        return 'danger';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'in_transit': return 'En transit';
      case 'delivered': return 'Livré';
      case 'loading': return 'En chargement';
      case 'customs': return 'En douane';
      case 'ready': return 'Prêt';
      default: return status;
    }
  };
  
  // Filter and sort containers
  const filteredContainers = containers
    .filter(container => {
      const matchesSearch = 
        container.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        container.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        container.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        container.destination.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = filterStatus === 'all' || container.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      const fieldA = a[sortField as keyof typeof a];
      const fieldB = b[sortField as keyof typeof b];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortOrder === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      }
      
      return 0;
    });
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  const handleViewTracking = (containerId: string) => {
    toast.info(`Suivi du conteneur ${containerId} en cours de chargement...`);
    // Navigation vers la page de suivi avec le conteneur sélectionné
    window.location.href = `/modules/freight/tracking?container=${containerId}`;
  };
  
  const handleViewDetails = (containerId: string) => {
    toast.info(`Détails du conteneur ${containerId}`);
    // Ici, vous pourriez ouvrir une boîte de dialogue ou naviguer vers une page de détails
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Conteneurs</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          <span>Nouveau Conteneur</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Conteneurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex-initial">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="in_transit">En transit</SelectItem>
                    <SelectItem value="delivered">Livrés</SelectItem>
                    <SelectItem value="loading">En chargement</SelectItem>
                    <SelectItem value="customs">En douane</SelectItem>
                    <SelectItem value="ready">Prêts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('number')}>
                    <div className="flex items-center">
                      Numéro
                      {sortField === 'number' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>
                    <div className="flex items-center">
                      Type
                      {sortField === 'type' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('location')}>
                    <div className="flex items-center">
                      Localisation
                      {sortField === 'location' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Statut
                      {sortField === 'status' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContainers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      Aucun conteneur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContainers.map((container) => (
                    <TableRow key={container.id}>
                      <TableCell className="font-medium">{container.number}</TableCell>
                      <TableCell>{container.type}</TableCell>
                      <TableCell>{container.client}</TableCell>
                      <TableCell>{container.location}</TableCell>
                      <TableCell>{container.destination}</TableCell>
                      <TableCell>
                        <StatusBadge status={getStatusColor(container.status)}>
                          {getStatusText(container.status)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewTracking(container.id)}
                            title="Suivi du conteneur"
                          >
                            <Truck className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(container.id)}
                            title="Détails du conteneur"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreightContainers;
