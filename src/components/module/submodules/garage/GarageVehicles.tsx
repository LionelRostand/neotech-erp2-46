import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Vehicle } from './types/garage-types';
import { Search, Plus, Car, Clock, AlertCircle, MoreHorizontal, Wrench, Calendar } from 'lucide-react';

// Sample data for vehicles
const sampleVehicles: Vehicle[] = [
  {
    id: "VH001",
    clientId: "CL001",
    brand: "Renault",
    model: "Clio",
    year: 2018,
    licensePlate: "AB-123-CD",
    vin: "1HGCM82633A123456",
    color: "Bleu",
    mileage: 45000,
    nextServiceDate: "2024-02-15",
    lastServiceDate: "2023-08-10",
    technicalControlDate: "2024-06-20",
    insuranceExpiryDate: "2024-01-15",
    status: "active",
    notes: "Entretien régulier, très bon état général",
    repairHistory: [
      {
        id: "RH001",
        vehicleId: "VH001",
        date: "2023-08-10",
        description: "Vidange + filtres",
        cost: 150.50,
        parts: [],
        laborHours: 1.5,
        mechanicId: "MECH001",
        status: "completed",
        invoiceId: "INV001"
      },
      {
        id: "RH002",
        vehicleId: "VH001",
        date: "2023-03-22",
        description: "Changement plaquettes de frein avant",
        cost: 210.75,
        parts: [],
        laborHours: 2,
        mechanicId: "MECH002",
        status: "completed",
        invoiceId: "INV002"
      }
    ]
  },
  {
    id: "VH002",
    clientId: "CL001",
    brand: "Peugeot",
    model: "308",
    year: 2020,
    licensePlate: "EF-456-GH",
    vin: "2JTDK82633B789012",
    color: "Gris",
    mileage: 28000,
    nextServiceDate: "2023-12-10",
    lastServiceDate: "2023-06-15",
    technicalControlDate: "2024-09-05",
    insuranceExpiryDate: "2024-03-28",
    status: "active",
    notes: "Véhicule secondaire du client",
    repairHistory: [
      {
        id: "RH003",
        vehicleId: "VH002",
        date: "2023-06-15",
        description: "Vidange + filtres",
        cost: 145.30,
        parts: [],
        laborHours: 1.5,
        mechanicId: "MECH001",
        status: "completed",
        invoiceId: "INV003"
      }
    ]
  },
  {
    id: "VH003",
    clientId: "CL002",
    brand: "Citroen",
    model: "C3",
    year: 2019,
    licensePlate: "IJ-789-KL",
    vin: "3GTDK82633C345678",
    color: "Rouge",
    mileage: 35000,
    nextServiceDate: "2023-11-20",
    lastServiceDate: "2023-05-25",
    technicalControlDate: "2023-12-15",
    insuranceExpiryDate: "2024-02-10",
    status: "in_repair",
    notes: "Problème récurrent de démarrage à froid",
    repairHistory: [
      {
        id: "RH004",
        vehicleId: "VH003",
        date: "2023-05-25",
        description: "Vidange + remplacement batterie",
        cost: 235.80,
        parts: [],
        laborHours: 2,
        mechanicId: "MECH002",
        status: "completed",
        invoiceId: "INV004"
      },
      {
        id: "RH005",
        vehicleId: "VH003",
        date: "2023-10-18",
        description: "Diagnostic système démarrage + réparation",
        cost: 320.45,
        parts: [],
        laborHours: 3,
        mechanicId: "MECH003",
        status: "in_progress",
        invoiceId: "INV005"
      }
    ]
  },
  {
    id: "VH004",
    clientId: "CL003",
    brand: "Ford",
    model: "Transit",
    year: 2021,
    licensePlate: "MN-012-OP",
    vin: "4LTDK82633D901234",
    color: "Blanc",
    mileage: 65000,
    nextServiceDate: "2023-11-05",
    lastServiceDate: "2023-05-10",
    technicalControlDate: "2024-08-22",
    insuranceExpiryDate: "2024-04-15",
    status: "active",
    notes: "Véhicule professionnel - Priorité haute pour les réparations",
    repairHistory: [
      {
        id: "RH006",
        vehicleId: "VH004",
        date: "2023-05-10",
        description: "Vidange + filtres + rotations pneus",
        cost: 280.90,
        parts: [],
        laborHours: 2.5,
        mechanicId: "MECH001",
        status: "completed",
        invoiceId: "INV006"
      }
    ]
  },
  {
    id: "VH005",
    clientId: "CL003",
    brand: "Mercedes",
    model: "Sprinter",
    year: 2020,
    licensePlate: "QR-345-ST",
    vin: "5BTDK82633E567890",
    color: "Blanc",
    mileage: 85000,
    nextServiceDate: "2023-10-28",
    lastServiceDate: "2023-04-30",
    technicalControlDate: "2024-07-18",
    insuranceExpiryDate: "2024-03-05",
    status: "active",
    notes: "Véhicule professionnel - Kilométrage élevé",
    repairHistory: [
      {
        id: "RH007",
        vehicleId: "VH005",
        date: "2023-04-30",
        description: "Révision complète + courroie distribution",
        cost: 750.60,
        parts: [],
        laborHours: 6,
        mechanicId: "MECH003",
        status: "completed",
        invoiceId: "INV007"
      }
    ]
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>;
    case 'inactive':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactif</Badge>;
    case 'in_repair':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">En réparation</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
  }
};

const GarageVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(sampleVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.clientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle vehicle selection for detail view
  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsVehicleDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Véhicules</h2>
        <Button className="flex items-center gap-2">
          <Plus size={18} />
          <span>Nouveau Véhicule</span>
        </Button>
      </div>

      {/* Vehicle search and filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recherche et filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher par marque, modèle, immatriculation..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="active">Actif</TabsTrigger>
                <TabsTrigger value="repair">En réparation</TabsTrigger>
                <TabsTrigger value="maintenance">Entretien requis</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des véhicules</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun véhicule trouvé. Ajoutez votre premier véhicule avec le bouton "Nouveau Véhicule".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Immatriculation</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Kilométrage</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Prochain entretien</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map(vehicle => (
                    <TableRow key={vehicle.id} onClick={() => handleVehicleSelect(vehicle)} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
                          <div className="text-sm text-muted-foreground">{vehicle.year} - {vehicle.color}</div>
                        </div>
                      </TableCell>
                      <TableCell>{vehicle.clientId}</TableCell>
                      <TableCell>{vehicle.mileage.toLocaleString('fr-FR')} km</TableCell>
                      <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{new Date(vehicle.nextServiceDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" title="Planifier un entretien">
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" title="Nouvelle réparation">
                            <Wrench className="h-4 w-4" />
                          </Button>
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

      {/* Vehicle detail dialog */}
      {selectedVehicle && (
        <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Détails du véhicule</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Informations du véhicule</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Marque et modèle</Label>
                    <div className="text-md font-medium">{selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year})</div>
                  </div>
                  <div>
                    <Label>Immatriculation</Label>
                    <div className="text-md">{selectedVehicle.licensePlate}</div>
                  </div>
                  <div>
                    <Label>Numéro VIN</Label>
                    <div className="text-md">{selectedVehicle.vin}</div>
                  </div>
                  <div>
                    <Label>Couleur</Label>
                    <div className="text-md">{selectedVehicle.color}</div>
                  </div>
                  <div>
                    <Label>Kilométrage</Label>
                    <div className="text-md">{selectedVehicle.mileage.toLocaleString('fr-FR')} km</div>
                  </div>
                  <div>
                    <Label>Propriétaire</Label>
                    <div className="text-md">{selectedVehicle.clientId}</div>
                  </div>
                  <div>
                    <Label>Statut</Label>
                    <div className="text-md">{getStatusBadge(selectedVehicle.status)}</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Dates importantes</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Dernier entretien</Label>
                    <div className="text-md flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(selectedVehicle.lastServiceDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <Label>Prochain entretien</Label>
                    <div className="text-md flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(selectedVehicle.nextServiceDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <Label>Contrôle technique</Label>
                    <div className="text-md flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(selectedVehicle.technicalControlDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <Label>Expiration assurance</Label>
                    <div className="text-md flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(selectedVehicle.insuranceExpiryDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <div className="text-md mt-1 p-2 bg-muted rounded-md">{selectedVehicle.notes}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-4">Historique des réparations</h3>
              {selectedVehicle.repairHistory.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Aucune réparation enregistrée pour ce véhicule.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Coût</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedVehicle.repairHistory.map(repair => (
                        <TableRow key={repair.id}>
                          <TableCell>{new Date(repair.date).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{repair.description}</TableCell>
                          <TableCell>{repair.cost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                          <TableCell>
                            {repair.status === 'completed' ? (
                              <Badge className="bg-green-100 text-green-800">Terminé</Badge>
                            ) : repair.status === 'in_progress' ? (
                              <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">Annulé</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsVehicleDialogOpen(false)}>Fermer</Button>
              <Button className="flex items-center gap-2" variant="outline">
                <Calendar className="h-4 w-4" />
                <span>Planifier entretien</span>
              </Button>
              <Button className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                <span>Nouvelle réparation</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GarageVehicles;
