import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Users, Search, RefreshCw, AlertTriangle } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/StatCard';
import AddClientDialog from './AddClientDialog';
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GarageClientsDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    clients, 
    isLoading, 
    refetchClients,
    error,
    isOffline,
    isReconnecting
  } = useGarageClients();

  const filteredClients = clients.filter(client => {
    if (!searchTerm) return true;
    
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || 
           (client.email && client.email.toLowerCase().includes(search)) ||
           (client.phone && client.phone.includes(search));
  });

  const handleClientAdded = () => {
    toast.success("Client ajouté avec succès");
    refetchClients();
  };

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Prénom",
      accessorKey: "firstName",
    },
    {
      header: "Nom",
      accessorKey: "lastName",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Adresse",
      accessorKey: "address",
      cell: ({ row }) => (
        <div>{row.original.address || "Non renseignée"}</div>
      ),
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => refetchClients()} 
            disabled={isLoading || isReconnecting}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isReconnecting ? 'animate-spin' : ''}`} />
            {isReconnecting ? 'Reconnexion...' : 'Rafraîchir'}
          </Button>
          <Button onClick={() => setShowAddDialog(true)} disabled={isOffline}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
        </div>
      </div>

      {isOffline && (
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Mode hors ligne</AlertTitle>
          <AlertDescription>
            Vous êtes actuellement hors ligne. Certaines fonctionnalités sont limitées et les données affichées peuvent ne pas être à jour.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur de connexion</AlertTitle>
          <AlertDescription>
            Une erreur s'est produite lors du chargement des données. Veuillez réessayer.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Clients"
          value={clients.length}
          description="Nombre total de clients"
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />
        <StatCard
          title="Clients Actifs"
          value={clients.filter(c => c.status === 'active').length}
          description="Clients avec véhicules actifs"
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />
        <StatCard
          title="Nouveaux Clients"
          value={clients.filter(c => {
            const date = new Date(c.createdAt);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          }).length}
          description="Ce mois-ci"
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />
      </div>

      <div className="pb-4">
        <div className="flex items-center border rounded-md px-3 max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input
            placeholder="Rechercher un client..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredClients}
            isLoading={isLoading || isReconnecting}
          />
        </CardContent>
      </Card>

      <AddClientDialog
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
};

export default GarageClientsDashboard;
