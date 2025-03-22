import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Search, Plus, Wrench, Car, Clock, User, PenSquare, Receipt, 
  Eye, CheckCircle, MoreHorizontal 
} from 'lucide-react';
import { toast } from 'sonner';
import CreateRepairDialog from './repairs/CreateRepairDialog';

// Sample data for repairs
const repairs = [
  {
    id: "RP001",
    vehicleId: "VH003",
    vehicleName: "Citroen C3",
    clientId: "CL002",
    clientName: "Marie Lambert",
    mechanicName: "Thomas Dubois",
    startDate: "2023-10-18",
    estimatedEndDate: "2023-10-20",
    status: "in_progress",
    description: "Diagnostic système démarrage + réparation",
    progress: 60,
    estimatedCost: 320.45,
    licensePlate: "IJ-789-KL"
  },
  {
    id: "RP002",
    vehicleId: "VH007",
    vehicleName: "Volkswagen Golf",
    clientId: "CL004",
    clientName: "Sophie Bernard",
    mechanicName: "Jean Martin",
    startDate: "2023-10-15",
    estimatedEndDate: "2023-10-17",
    status: "awaiting_parts",
    description: "Remplacement système d'embrayage",
    progress: 25,
    estimatedCost: 580.00,
    licensePlate: "UV-678-WX"
  },
  {
    id: "RP003",
    vehicleId: "VH005",
    vehicleName: "Mercedes Sprinter",
    clientId: "CL003",
    clientName: "Pierre Martin",
    mechanicName: "Thomas Dubois",
    startDate: "2023-10-16",
    estimatedEndDate: "2023-10-19",
    status: "awaiting_approval",
    description: "Remplacement injecteurs diesel",
    progress: 0,
    estimatedCost: 950.75,
    licensePlate: "QR-345-ST"
  },
  {
    id: "RP004",
    vehicleId: "VH002",
    vehicleName: "Peugeot 308",
    clientId: "CL001",
    clientName: "Jean Dupont",
    mechanicName: "Jean Martin",
    startDate: "2023-10-10",
    estimatedEndDate: "2023-10-11",
    status: "completed",
    description: "Vidange + contrôle niveaux",
    progress: 100,
    estimatedCost: 145.30,
    licensePlate: "EF-456-GH"
  },
  {
    id: "RP005",
    vehicleId: "VH008",
    vehicleName: "Toyota Yaris",
    clientId: "CL005",
    clientName: "Thomas Leclerc",
    mechanicName: "Thomas Dubois",
    startDate: "2023-10-12",
    estimatedEndDate: "2023-10-14",
    status: "completed",
    description: "Remplacement plaquettes et disques de frein",
    progress: 100,
    estimatedCost: 390.50,
    licensePlate: "YZ-901-AB"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'in_progress':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">En cours</Badge>;
    case 'awaiting_parts':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">En attente de pièces</Badge>;
    case 'awaiting_approval':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">En attente d'approbation</Badge>;
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Terminé</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Annulé</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
  }
};

const GarageRepairs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [repairs, setRepairs] = useState(window.repairs || []);
  
  // Filter repairs based on search term
  const filteredRepairs = repairs.filter(repair => 
    repair.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRepair = (newRepair: any) => {
    const id = `RP${String(repairs.length + 1).padStart(3, '0')}`;
    const repair = { id, ...newRepair };
    setRepairs(prev => [...prev, repair]);
    toast.success(`Réparation ${id} créée avec succès`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Réparations</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus size={18} />
          <span>Nouvelle Réparation</span>
        </Button>
      </div>

      {/* Repair search and filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recherche et filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher par véhicule, client, immatriculation..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="in_progress">En cours</TabsTrigger>
                <TabsTrigger value="awaiting">En attente</TabsTrigger>
                <TabsTrigger value="completed">Terminées</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Repairs list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des réparations</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRepairs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune réparation trouvée. Créez une nouvelle réparation avec le bouton "Nouvelle Réparation".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Coût estimé</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRepairs.map(repair => (
                    <TableRow key={repair.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{repair.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{repair.vehicleName}</div>
                            <div className="text-xs text-muted-foreground">{repair.licensePlate}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{repair.clientName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <div className="text-xs text-muted-foreground">Début: {new Date(repair.startDate).toLocaleDateString('fr-FR')}</div>
                          <div className="text-xs text-muted-foreground">Fin prévue: {new Date(repair.estimatedEndDate).toLocaleDateString('fr-FR')}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(repair.status)}</TableCell>
                      <TableCell>
                        <div className="w-32">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs">{repair.progress}%</span>
                          </div>
                          <Progress value={repair.progress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {repair.estimatedCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" title="Voir détails">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {repair.status !== 'completed' && (
                            <Button variant="outline" size="icon" title="Mettre à jour">
                              <PenSquare className="h-4 w-4" />
                            </Button>
                          )}
                          {repair.status === 'completed' && (
                            <Button variant="outline" size="icon" title="Facturer">
                              <Receipt className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="icon" title="Plus d'options">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mechanic status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Statut des mécaniciens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Jean Martin</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-500">Réparations actives:</span> 1
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Disponible dans:</span> 2 heures
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold">Thomas Dubois</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-500">Réparations actives:</span> 2
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Disponible dans:</span> 1 jour
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Wrench className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Sophie Moreau</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-500">Réparations actives:</span> 0
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Disponibilité:</span> Immédiate
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreateRepairDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSave={handleCreateRepair}
        clientsMap={clientsMap}
        vehiclesMap={vehiclesMap}
        mechanicsMap={mechanicsMap}
      />
    </div>
  );
};

export default GarageRepairs;
