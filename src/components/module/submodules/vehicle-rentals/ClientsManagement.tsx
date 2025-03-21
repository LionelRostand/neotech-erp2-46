import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Client } from './types/rental-types';
import CreateClientDialog from './dialogs/client/CreateClientDialog';
import { toast } from 'sonner';
import ClientsList from './components/client/ClientsList';
import ClientsSearchBar from './components/client/ClientsSearchBar';

// Mock clients data
const mockClients: Client[] = [
  {
    id: "c1",
    firstName: "Martin",
    lastName: "Dupont",
    email: "martin.dupont@example.com",
    phone: "06 12 34 56 78",
    address: "123 Rue de Paris, 75001 Paris",
    drivingLicenseNumber: "12AB34567",
    drivingLicenseExpiry: "2025-05-12",
    idNumber: "123456789012",
    birthDate: "1985-03-15",
    nationality: "Française",
    notes: "Client régulier depuis 2020",
    createdAt: "2020-03-10",
    updatedAt: "2023-01-15"
  },
  {
    id: "c2",
    firstName: "Sophie",
    lastName: "Lefebvre",
    email: "sophie.lefebvre@example.com",
    phone: "07 23 45 67 89",
    address: "456 Avenue des Champs-Élysées, 75008 Paris",
    drivingLicenseNumber: "23CD45678",
    drivingLicenseExpiry: "2024-11-30",
    idNumber: "234567890123",
    birthDate: "1990-07-22",
    nationality: "Française",
    notes: "",
    createdAt: "2021-05-20",
    updatedAt: "2023-02-10"
  },
  {
    id: "c3",
    firstName: "Jean",
    lastName: "Moreau",
    email: "jean.moreau@example.com",
    phone: "06 34 56 78 90",
    address: "789 Boulevard Saint-Germain, 75006 Paris",
    drivingLicenseNumber: "34EF56789",
    drivingLicenseExpiry: "2026-08-25",
    idNumber: "345678901234",
    birthDate: "1978-11-05",
    nationality: "Française",
    notes: "Préfère les véhicules avec transmission automatique",
    createdAt: "2022-01-15",
    updatedAt: "2023-03-25"
  },
  {
    id: "c4",
    firstName: "Marie",
    lastName: "Durand",
    email: "marie.durand@example.com",
    phone: "07 45 67 89 01",
    address: "101 Rue de Rivoli, 75001 Paris",
    drivingLicenseNumber: "45GH67890",
    drivingLicenseExpiry: "2027-04-18",
    idNumber: "456789012345",
    birthDate: "1982-09-30",
    nationality: "Française",
    notes: "",
    createdAt: "2021-07-10",
    updatedAt: "2023-04-12"
  },
  {
    id: "c5",
    firstName: "Thomas",
    lastName: "Bernard",
    email: "thomas.bernard@example.com",
    phone: "06 56 78 90 12",
    address: "202 Avenue Foch, 75116 Paris",
    drivingLicenseNumber: "56IJ78901",
    drivingLicenseExpiry: "2025-12-05",
    idNumber: "567890123456",
    birthDate: "1995-02-18",
    nationality: "Française",
    notes: "First-time client",
    createdAt: "2023-05-05",
    updatedAt: "2023-05-05"
  }
];

const ClientsManagement = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.includes(searchTerm);
  });

  const handleClientCreated = (newClient: Client) => {
    setClients(prevClients => [newClient, ...prevClients]);
    toast.success('Client ajouté avec succès');
  };

  const handleRefresh = () => {
    setClients([...mockClients]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des Clients</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Client
        </Button>
      </div>

      <ClientsSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        onNewClient={() => setIsCreateDialogOpen(true)}
      />

      <Card>
        <CardContent className="p-0">
          <ClientsList clients={filteredClients} />
        </CardContent>
      </Card>

      <CreateClientDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
};

export default ClientsManagement;
