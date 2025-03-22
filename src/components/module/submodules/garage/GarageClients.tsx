import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Client } from './types/garage-types';
import { Search, Plus, Mail, Phone, Car, Clock, MoreHorizontal, CalendarCheck, Bell } from 'lucide-react';

// Sample data for clients
const sampleClients: Client[] = [
  {
    id: "CL001",
    name: "Jean Dupont",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "06 12 34 56 78",
    address: "123 Rue de Paris, 75001 Paris",
    vehicles: ["VH001", "VH002"],
    lastVisit: "2023-06-15",
    totalSpent: 1250.75,
    notes: "Client fidèle depuis 2018. Préfère être contacté par téléphone.",
    createdAt: "2018-03-22"
  },
  {
    id: "CL002",
    name: "Marie Lambert",
    firstName: "Marie",
    lastName: "Lambert",
    email: "marie.lambert@example.com",
    phone: "06 98 76 54 32",
    address: "45 Avenue Victor Hugo, 69002 Lyon",
    vehicles: ["VH003"],
    lastVisit: "2023-09-28",
    totalSpent: 890.50,
    notes: "Nouvelle cliente recommandée par Jean Dupont.",
    createdAt: "2023-05-10"
  },
  {
    id: "CL003",
    name: "Pierre Martin",
    firstName: "Pierre",
    lastName: "Martin",
    email: "pierre.martin@example.com",
    phone: "07 11 22 33 44",
    address: "8 Boulevard Alsace, 33000 Bordeaux",
    vehicles: ["VH004", "VH005", "VH006"],
    lastVisit: "2023-08-05",
    totalSpent: 3245.20,
    notes: "Possède plusieurs véhicules. Entreprise de livraison.",
    createdAt: "2019-11-15"
  },
  {
    id: "CL004",
    name: "Sophie Bernard",
    firstName: "Sophie",
    lastName: "Bernard",
    email: "sophie.bernard@example.com",
    phone: "06 55 44 33 22",
    address: "27 Rue des Fleurs, 44000 Nantes",
    vehicles: ["VH007"],
    lastVisit: "2023-10-12",
    totalSpent: 520.80,
    notes: "Préfère les rendez-vous en matinée.",
    createdAt: "2021-04-18"
  },
  {
    id: "CL005",
    name: "Thomas Leclerc",
    firstName: "Thomas",
    lastName: "Leclerc",
    email: "thomas.leclerc@example.com",
    phone: "07 99 88 77 66",
    address: "13 Avenue de la République, 31000 Toulouse",
    vehicles: ["VH008", "VH009"],
    lastVisit: "2023-07-22",
    totalSpent: 1870.45,
    notes: "Demande souvent des facilités de paiement.",
    createdAt: "2020-09-30"
  }
];

const GarageClients = () => {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  // Handle client selection for detail view
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setIsClientDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Clients</h2>
        <Button className="flex items-center gap-2">
          <Plus size={18} />
          <span>Nouveau Client</span>
        </Button>
      </div>

      {/* Client search and filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recherche et filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher par nom, email, téléphone..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="recent">Récents</TabsTrigger>
                <TabsTrigger value="regular">Réguliers</TabsTrigger>
                <TabsTrigger value="inactive">Inactifs</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Clients list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des clients</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun client trouvé. Ajoutez votre premier client avec le bouton "Nouveau Client".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Véhicules</TableHead>
                    <TableHead>Dernière visite</TableHead>
                    <TableHead>Total dépensé</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map(client => (
                    <TableRow key={client.id} onClick={() => handleClientSelect(client)} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{client.firstName} {client.lastName}</div>
                          <div className="text-sm text-muted-foreground">Client depuis {new Date(client.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' })}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{client.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{client.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-muted-foreground">
                          <Car className="mr-1 h-3 w-3" />
                          {client.vehicles.length}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{new Date(client.lastVisit).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {client.totalSpent.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" title="Prendre rendez-vous">
                            <CalendarCheck className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" title="Envoyer une notification">
                            <Bell className="h-4 w-4" />
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

      {/* Client detail dialog */}
      {selectedClient && (
        <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Détails du client</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Nom complet</Label>
                    <div className="text-md">{selectedClient.firstName} {selectedClient.lastName}</div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="text-md flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      {selectedClient.email}
                    </div>
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <div className="text-md flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      {selectedClient.phone}
                    </div>
                  </div>
                  <div>
                    <Label>Adresse</Label>
                    <div className="text-md">{selectedClient.address}</div>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea 
                      value={selectedClient.notes} 
                      className="mt-1" 
                      readOnly 
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Historique et véhicules</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Client depuis</Label>
                    <div className="text-md">{new Date(selectedClient.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  <div>
                    <Label>Dernière visite</Label>
                    <div className="text-md flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(selectedClient.lastVisit).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <Label>Total dépensé</Label>
                    <div className="text-md font-semibold">{selectedClient.totalSpent.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                  </div>
                  <div>
                    <Label>Véhicules ({selectedClient.vehicles.length})</Label>
                    <div className="mt-2 space-y-2">
                      {selectedClient.vehicles.map(vehicleId => (
                        <div key={vehicleId} className="flex items-center p-2 bg-muted rounded-md">
                          <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{vehicleId}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsClientDialogOpen(false)}>Fermer</Button>
              <Button className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" />
                <span>Prendre RDV</span>
              </Button>
              <Button variant="default">Modifier</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GarageClients;
