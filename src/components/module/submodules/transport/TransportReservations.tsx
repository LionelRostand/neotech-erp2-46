
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, List, Plus, Search, Filter, Eye, Edit, Trash2, History, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TransportReservation, TransportClient } from './types/transport-types';
import ViewReservationDialog from './reservations/ViewReservationDialog';
import DeleteReservationDialog from './reservations/DeleteReservationDialog';
import ReservationFormDialog from './reservations/ReservationFormDialog';
import ClientHistoryDialog from './reservations/ClientHistoryDialog';
import ContractGenerationDialog from './reservations/ContractGenerationDialog';

const TransportReservations = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  
  // Selected reservation and client
  const [selectedReservation, setSelectedReservation] = useState<TransportReservation | null>(null);
  const [selectedClient, setSelectedClient] = useState<TransportClient | null>(null);

  // Sample data for reservations
  const [reservations, setReservations] = useState<TransportReservation[]>([
    {
      id: "TR-2023-001",
      clientId: "cli-001",
      vehicleId: "veh-001",
      driverId: "drv-001",
      service: "airport-transfer",
      date: "2023-07-15",
      time: "09:30",
      pickup: {
        address: "Aéroport Charles de Gaulle, Terminal 2E"
      },
      dropoff: {
        address: "Hôtel Ritz Paris, 15 Place Vendôme, 75001 Paris"
      },
      status: "confirmed",
      price: 120,
      isPaid: true,
      needsDriver: true,
      contractGenerated: true,
      createdAt: "2023-07-10T14:30:00Z",
      updatedAt: "2023-07-10T14:30:00Z"
    },
    {
      id: "TR-2023-002",
      clientId: "cli-002",
      vehicleId: "veh-002",
      driverId: "drv-002",
      service: "hourly-hire",
      date: "2023-07-15",
      time: "14:00",
      pickup: {
        address: "Hôtel Le Bristol, 112 Rue du Faubourg Saint-Honoré, 75008 Paris"
      },
      dropoff: {
        address: "Hôtel Le Bristol, 112 Rue du Faubourg Saint-Honoré, 75008 Paris"
      },
      status: "pending",
      price: 200,
      isPaid: false,
      needsDriver: true,
      contractGenerated: false,
      createdAt: "2023-07-11T10:15:00Z",
      updatedAt: "2023-07-11T10:15:00Z"
    },
    {
      id: "TR-2023-003",
      clientId: "cli-003",
      vehicleId: "veh-003",
      driverId: "drv-003",
      service: "business-travel",
      date: "2023-07-16",
      time: "10:15",
      pickup: {
        address: "Tour Eiffel, Champ de Mars, 5 Avenue Anatole France, 75007 Paris"
      },
      dropoff: {
        address: "La Défense, 92400 Courbevoie"
      },
      status: "confirmed",
      price: 150,
      isPaid: true,
      needsDriver: true,
      contractGenerated: true,
      createdAt: "2023-07-12T08:45:00Z",
      updatedAt: "2023-07-12T08:45:00Z"
    },
    {
      id: "TR-2023-004",
      clientId: "cli-004",
      vehicleId: "veh-004",
      service: "city-tour",
      date: "2023-07-17",
      time: "08:45",
      pickup: {
        address: "Hôtel Plaza Athénée, 25 Avenue Montaigne, 75008 Paris"
      },
      dropoff: {
        address: "Hôtel Plaza Athénée, 25 Avenue Montaigne, 75008 Paris"
      },
      status: "cancelled",
      price: 350,
      isPaid: false,
      needsDriver: true,
      contractGenerated: false,
      createdAt: "2023-07-13T16:30:00Z",
      updatedAt: "2023-07-14T09:20:00Z"
    },
    {
      id: "TR-2023-005",
      clientId: "cli-001",
      vehicleId: "veh-005",
      service: "airport-transfer",
      date: "2023-07-18",
      time: "16:30",
      pickup: {
        address: "Hôtel Ritz Paris, 15 Place Vendôme, 75001 Paris"
      },
      dropoff: {
        address: "Aéroport d'Orly, Terminal Sud"
      },
      status: "confirmed",
      price: 100,
      isPaid: true,
      needsDriver: false,
      contractGenerated: true,
      createdAt: "2023-07-15T11:45:00Z",
      updatedAt: "2023-07-15T11:45:00Z"
    }
  ]);

  // Mock client data
  const mockClients: Record<string, TransportClient> = {
    "cli-001": {
      id: "cli-001",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@example.com",
      phone: "+33612345678",
      vip: true,
      loyaltyPoints: 250,
      createdAt: "2023-01-15T00:00:00Z",
      updatedAt: "2023-06-20T00:00:00Z"
    },
    "cli-002": {
      id: "cli-002",
      firstName: "Marie",
      lastName: "Legrand",
      email: "marie.legrand@example.com",
      phone: "+33623456789",
      vip: false,
      loyaltyPoints: 120,
      createdAt: "2023-02-10T00:00:00Z",
      updatedAt: "2023-05-15T00:00:00Z"
    },
    "cli-003": {
      id: "cli-003",
      firstName: "Thomas",
      lastName: "Petit",
      email: "thomas.petit@example.com",
      phone: "+33634567890",
      vip: false,
      loyaltyPoints: 80,
      createdAt: "2023-03-05T00:00:00Z",
      updatedAt: "2023-06-05T00:00:00Z"
    },
    "cli-004": {
      id: "cli-004",
      firstName: "Sophie",
      lastName: "Bernard",
      email: "sophie.bernard@example.com",
      phone: "+33645678901",
      vip: true,
      loyaltyPoints: 320,
      createdAt: "2023-01-20T00:00:00Z",
      updatedAt: "2023-07-01T00:00:00Z"
    },
    "cli-005": {
      id: "cli-005",
      firstName: "Laurent",
      lastName: "Dubois",
      email: "laurent.dubois@example.com",
      phone: "+33656789012",
      vip: false,
      loyaltyPoints: 50,
      createdAt: "2023-04-12T00:00:00Z",
      updatedAt: "2023-06-25T00:00:00Z"
    }
  };

  // Mock vehicle names
  const mockVehicleNames: Record<string, string> = {
    "veh-001": "Mercedes Classe E",
    "veh-002": "BMW Série 5",
    "veh-003": "Audi A6",
    "veh-004": "Mercedes Classe V",
    "veh-005": "Tesla Model S"
  };

  // Mock driver names
  const mockDriverNames: Record<string, string> = {
    "drv-001": "Marc Leblanc",
    "drv-002": "Sophie Martin",
    "drv-003": "Nicolas Durand",
    "drv-004": "Pierre Moreau",
    "drv-005": "Julie Leroy"
  };

  // Filter reservations based on search term
  const filteredReservations = reservations.filter(
    (reservation) =>
      mockClients[reservation.clientId]?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mockClients[reservation.clientId]?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mockVehicleNames[reservation.vehicleId].toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get badge style based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmée</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500">En cours</Badge>;
      case "completed":
        return <Badge className="bg-gray-500">Terminée</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge>Inconnue</Badge>;
    }
  };

  // Format service types for display
  const getServiceLabel = (service: string) => {
    switch (service) {
      case "airport-transfer": return "Transfert Aéroport";
      case "city-tour": return "Visite de ville";
      case "business-travel": return "Voyage d'affaires";
      case "wedding": return "Mariage";
      case "event": return "Événement";
      case "hourly-hire": return "Location à l'heure";
      case "long-distance": return "Longue distance";
      case "custom": return "Personnalisé";
      default: return service;
    }
  };

  // Handle opening view dialog
  const handleViewReservation = (reservation: TransportReservation) => {
    setSelectedReservation(reservation);
    setViewDialogOpen(true);
  };

  // Handle opening edit dialog
  const handleEditReservation = (reservation: TransportReservation) => {
    setSelectedReservation(reservation);
    setEditDialogOpen(true);
  };

  // Handle opening delete dialog
  const handleDeleteReservation = (reservation: TransportReservation) => {
    setSelectedReservation(reservation);
    setDeleteDialogOpen(true);
  };

  // Handle opening client history dialog
  const handleViewClientHistory = (clientId: string) => {
    const client = mockClients[clientId];
    if (client) {
      setSelectedClient(client);
      // Get client's reservations
      const clientReservations = reservations.filter(r => r.clientId === clientId);
      if (clientReservations.length > 0) {
        setHistoryDialogOpen(true);
      } else {
        toast.info("Ce client n'a pas d'historique de réservations");
      }
    }
  };

  // Handle opening contract generation dialog
  const handleGenerateContract = (reservation: TransportReservation) => {
    setSelectedReservation(reservation);
    setContractDialogOpen(true);
  };

  // Handle saving a new or edited reservation
  const handleSaveReservation = (formData: any) => {
    if (selectedReservation && editDialogOpen) {
      // Edit existing reservation
      const updatedReservations = reservations.map(r => 
        r.id === selectedReservation.id 
          ? {
              ...r, 
              clientId: formData.clientId,
              vehicleId: formData.vehicleId,
              driverId: formData.needsDriver ? formData.driverId : undefined,
              service: formData.service,
              date: formData.date.toISOString().split('T')[0],
              time: formData.time,
              pickup: { address: formData.pickupAddress },
              dropoff: { address: formData.dropoffAddress },
              status: formData.status,
              price: formData.price,
              isPaid: formData.isPaid,
              needsDriver: formData.needsDriver,
              updatedAt: new Date().toISOString()
            } 
          : r
      );
      setReservations(updatedReservations);
    } else {
      // Create new reservation
      const newReservation: TransportReservation = {
        id: `TR-${new Date().getFullYear()}-${(reservations.length + 1).toString().padStart(3, '0')}`,
        clientId: formData.clientId,
        vehicleId: formData.vehicleId,
        driverId: formData.needsDriver ? formData.driverId : undefined,
        service: formData.service,
        date: formData.date.toISOString().split('T')[0],
        time: formData.time,
        pickup: { address: formData.pickupAddress },
        dropoff: { address: formData.dropoffAddress },
        status: formData.status || "pending",
        price: formData.price,
        isPaid: formData.isPaid,
        needsDriver: formData.needsDriver,
        contractGenerated: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setReservations([...reservations, newReservation]);
    }
  };

  // Handle contract generation completed
  const handleContractGenerated = () => {
    if (selectedReservation) {
      const updatedReservations = reservations.map(r => 
        r.id === selectedReservation.id 
          ? { ...r, contractGenerated: true, updatedAt: new Date().toISOString() } 
          : r
      );
      setReservations(updatedReservations);
    }
  };

  // Handle successful deletion
  const handleReservationDeleted = () => {
    if (selectedReservation) {
      setReservations(reservations.filter(r => r.id !== selectedReservation.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Réservations de Transport</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus size={16} />
          <span>Nouvelle réservation</span>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par client, véhicule ou ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Liste des réservations</CardTitle>
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as 'list' | 'calendar')}
              className="w-[400px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List size={16} />
                  <span>Liste</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <CalendarCheck size={16} />
                  <span>Calendrier</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Chauffeur</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Contrat</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-4 text-muted-foreground">
                        Aucune réservation trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReservations.map((reservation) => {
                      const client = mockClients[reservation.clientId];
                      return (
                        <TableRow key={reservation.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{reservation.id}</TableCell>
                          <TableCell>
                            <button 
                              className="hover:underline text-blue-600 flex items-center"
                              onClick={() => handleViewClientHistory(reservation.clientId)}
                            >
                              {client?.firstName} {client?.lastName}
                              {client?.vip && <Badge className="ml-2 bg-purple-500">VIP</Badge>}
                            </button>
                          </TableCell>
                          <TableCell>{reservation.date}</TableCell>
                          <TableCell>{reservation.time}</TableCell>
                          <TableCell>{getServiceLabel(reservation.service)}</TableCell>
                          <TableCell>{mockVehicleNames[reservation.vehicleId]}</TableCell>
                          <TableCell>
                            {reservation.needsDriver 
                              ? (reservation.driverId ? mockDriverNames[reservation.driverId] : "Non assigné") 
                              : "Pas de chauffeur"}
                          </TableCell>
                          <TableCell>
                            {reservation.price} €
                            {reservation.isPaid ? (
                              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300">Payé</Badge>
                            ) : (
                              <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">Impayé</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {reservation.contractGenerated ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Généré</Badge>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1"
                                onClick={() => handleGenerateContract(reservation)}
                              >
                                <FileText className="h-3 w-3" />
                                Générer
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewReservation(reservation)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditReservation(reservation)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteReservation(reservation)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[400px]">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Vue Calendrier</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  L'affichage du calendrier des réservations sera implémenté prochainement.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {selectedReservation && (
        <>
          <ViewReservationDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            reservation={selectedReservation}
            clientName={`${mockClients[selectedReservation.clientId]?.firstName} ${mockClients[selectedReservation.clientId]?.lastName}`}
            vehicleName={mockVehicleNames[selectedReservation.vehicleId]}
            driverName={selectedReservation.driverId ? mockDriverNames[selectedReservation.driverId] : undefined}
          />
          
          <DeleteReservationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            reservation={selectedReservation}
            onDeleted={handleReservationDeleted}
          />
          
          <ReservationFormDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            reservation={selectedReservation}
            onSave={handleSaveReservation}
            isEditing={true}
          />
          
          <ContractGenerationDialog
            open={contractDialogOpen}
            onOpenChange={setContractDialogOpen}
            reservation={selectedReservation}
            clientName={`${mockClients[selectedReservation.clientId]?.firstName} ${mockClients[selectedReservation.clientId]?.lastName}`}
            vehicleName={mockVehicleNames[selectedReservation.vehicleId]}
            driverName={selectedReservation.driverId ? mockDriverNames[selectedReservation.driverId] : undefined}
            onContractGenerated={handleContractGenerated}
          />
        </>
      )}
      
      {/* New reservation dialog */}
      <ReservationFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={handleSaveReservation}
      />
      
      {/* Client history dialog */}
      {selectedClient && (
        <ClientHistoryDialog
          open={historyDialogOpen}
          onOpenChange={setHistoryDialogOpen}
          client={selectedClient}
          reservations={reservations.filter(r => r.clientId === selectedClient.id)}
          onViewReservation={handleViewReservation}
        />
      )}
    </div>
  );
};

export default TransportReservations;
