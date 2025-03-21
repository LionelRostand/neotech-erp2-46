import React, { useState } from 'react';
import { Package, Search, Plus, Filter, SortDesc, Calendar, History, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import StatCard from '@/components/StatCard';
import { useToast } from '@/hooks/use-toast';

const FreightContainers: React.FC = () => {
  const [showNewContainer, setShowNewContainer] = useState(false);
  const { toast } = useToast();

  // Sample data for containers
  const containers = [
    { id: 'CONT-1001', type: '40HC', location: 'Port de Marseille', status: 'Disponible', lastUsed: '2023-10-01', temperature: null },
    { id: 'CONT-1002', type: '20GP', location: 'Terminal Le Havre', status: 'En transit', lastUsed: '2023-10-05', temperature: null },
    { id: 'CONT-1003', type: '45HC', location: 'Entrepôt Paris', status: 'En maintenance', lastUsed: '2023-09-20', temperature: null },
    { id: 'CONT-1004', type: '40GP', location: 'Port de Marseille', status: 'Réservé', lastUsed: '2023-10-08', temperature: null },
    { id: 'CONT-1005', type: '20GP', location: 'Terminal Le Havre', status: 'Disponible', lastUsed: '2023-09-28', temperature: null },
    { id: 'CONT-1006', type: '40RF', location: 'Terminal Lyon', status: 'En transit', lastUsed: '2023-10-12', temperature: '-18°C' },
    { id: 'CONT-1007', type: '20RF', location: 'Port de Bordeaux', status: 'Disponible', lastUsed: '2023-10-07', temperature: '4°C' },
  ];

  // Container history data
  const containerHistory = [
    { date: '2023-10-01', event: 'Déchargement', location: 'Port de Marseille', shipment: 'EXP-1030' },
    { date: '2023-09-25', event: 'Transit', location: 'Méditerranée', shipment: 'EXP-1030' },
    { date: '2023-09-20', event: 'Chargement', location: 'Port d\'Alexandrie', shipment: 'EXP-1030' },
    { date: '2023-09-15', event: 'Maintenance', location: 'Port d\'Alexandrie', shipment: '-' },
    { date: '2023-09-01', event: 'Déchargement', location: 'Port d\'Alexandrie', shipment: 'EXP-1025' },
  ];

  // Stats for the dashboard
  const statsData = [
    {
      title: "Total conteneurs",
      value: "125",
      icon: <Package className="h-8 w-8 text-blue-500" />,
      description: "Flotte totale de conteneurs"
    },
    {
      title: "Disponibles",
      value: "68",
      icon: <Package className="h-8 w-8 text-green-500" />,
      description: "Conteneurs disponibles"
    },
    {
      title: "En transit",
      value: "42",
      icon: <Package className="h-8 w-8 text-amber-500" />,
      description: "Conteneurs en mouvement"
    },
    {
      title: "Maintenance",
      value: "15",
      icon: <Package className="h-8 w-8 text-red-500" />,
      description: "Conteneurs en réparation"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'En transit':
        return 'bg-amber-100 text-amber-800';
      case 'En maintenance':
        return 'bg-red-100 text-red-800';
      case 'Réservé':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewContainer = () => {
    setShowNewContainer(false);
    toast({
      title: "Conteneur ajouté",
      description: "Le nouveau conteneur a été ajouté avec succès.",
    });
  };

  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);

  const openContainerDetails = (containerId: string) => {
    setSelectedContainer(containerId);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <h2 className="text-xl font-bold">Gestion des Conteneurs</h2>
          <Dialog open={showNewContainer} onOpenChange={setShowNewContainer}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Conteneur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau conteneur</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="container-id" className="text-right">
                    ID
                  </Label>
                  <Input id="container-id" defaultValue="CONT-" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="container-type" className="text-right">
                    Type
                  </Label>
                  <Select defaultValue="40HC">
                    <SelectTrigger className="col-span-3" id="container-type">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20GP">20' Standard (20GP)</SelectItem>
                      <SelectItem value="40GP">40' Standard (40GP)</SelectItem>
                      <SelectItem value="40HC">40' High Cube (40HC)</SelectItem>
                      <SelectItem value="45HC">45' High Cube (45HC)</SelectItem>
                      <SelectItem value="20RF">20' Réfrigéré (20RF)</SelectItem>
                      <SelectItem value="40RF">40' Réfrigéré (40RF)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="container-location" className="text-right">
                    Emplacement
                  </Label>
                  <Input id="container-location" defaultValue="" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="container-status" className="text-right">
                    Statut
                  </Label>
                  <Select defaultValue="disponible">
                    <SelectTrigger className="col-span-3" id="container-status">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="en_transit">En transit</SelectItem>
                      <SelectItem value="en_maintenance">En maintenance</SelectItem>
                      <SelectItem value="reserve">Réservé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleNewContainer}>Ajouter le conteneur</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
            <Button variant="outline" size="sm">
              <SortDesc className="mr-2 h-4 w-4" />
              Trier
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un conteneur..."
              className="pl-8 w-[250px]"
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="available">Disponibles</TabsTrigger>
            <TabsTrigger value="transit">En transit</TabsTrigger>
            <TabsTrigger value="refrigerated">Réfrigérés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Emplacement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Température</TableHead>
                  <TableHead>Dernière utilisation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {containers.map((container) => (
                  <TableRow key={container.id}>
                    <TableCell className="font-medium">{container.id}</TableCell>
                    <TableCell>{container.type}</TableCell>
                    <TableCell>{container.location}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(container.status)}>
                        {container.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {container.temperature ? (
                        <span className="flex items-center">
                          <Thermometer className="h-4 w-4 mr-1 text-blue-500" />
                          {container.temperature}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{container.lastUsed}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openContainerDetails(container.id)}
                      >
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="available">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Emplacement</TableHead>
                  <TableHead>Dernière utilisation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {containers
                  .filter(container => container.status === 'Disponible')
                  .map((container) => (
                    <TableRow key={container.id}>
                      <TableCell className="font-medium">{container.id}</TableCell>
                      <TableCell>{container.type}</TableCell>
                      <TableCell>{container.location}</TableCell>
                      <TableCell>{container.lastUsed}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Détails</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          {/* Other tabs have similar structure */}
          <TabsContent value="transit">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Emplacement actuel</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {containers
                  .filter(container => container.status === 'En transit')
                  .map((container) => (
                    <TableRow key={container.id}>
                      <TableCell className="font-medium">{container.id}</TableCell>
                      <TableCell>{container.type}</TableCell>
                      <TableCell>{container.location}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Suivi</Button>
                        <Button variant="ghost" size="sm">Détails</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="refrigerated">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Emplacement</TableHead>
                  <TableHead>Température</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {containers
                  .filter(container => container.type.includes('RF'))
                  .map((container) => (
                    <TableRow key={container.id}>
                      <TableCell className="font-medium">{container.id}</TableCell>
                      <TableCell>{container.type}</TableCell>
                      <TableCell>{container.location}</TableCell>
                      <TableCell>
                        <span className="flex items-center">
                          <Thermometer className="h-4 w-4 mr-1 text-blue-500" />
                          {container.temperature || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(container.status)}>
                          {container.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Détails</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
      
      {selectedContainer && (
        <Dialog open={!!selectedContainer} onOpenChange={() => setSelectedContainer(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Détails du Conteneur {selectedContainer}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Type:</p>
                      <p>40' High Cube (40HC)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Statut:</p>
                      <Badge className="bg-green-100 text-green-800">Disponible</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Emplacement actuel:</p>
                      <p>Port de Marseille</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Dernière utilisation:</p>
                      <p>2023-10-01</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Dimensions:</p>
                      <p>L: 12.19m x l: 2.44m x H: 2.90m</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Capacité:</p>
                      <p>76.3 m³ / 26,780 kg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Historique</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Événement</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Expédition</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {containerHistory.map((event, index) => (
                        <TableRow key={index}>
                          <TableCell>{event.date}</TableCell>
                          <TableCell>{event.event}</TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell>{event.shipment}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedContainer(null)}>
                  Fermer
                </Button>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Réserver
                </Button>
                <Button variant="outline">
                  <History className="mr-2 h-4 w-4" />
                  Historique complet
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FreightContainers;
