
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Users, Car, Clock, UserX } from "lucide-react";
import StatCard from '@/components/StatCard';
import { useGarageData } from '@/hooks/garage/useGarageData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AddClientDialog from './AddClientDialog';

const GarageClientsDashboard = () => {
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const { clients, vehicles, isLoading } = useGarageData();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
    newThisMonth: clients.filter(c => {
      const thisMonth = new Date();
      const clientDate = c.lastVisit ? new Date(c.lastVisit) : null;
      return clientDate && clientDate.getMonth() === thisMonth.getMonth();
    }).length
  };

  const getStatusColor = (status: 'active' | 'inactive') => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clients"
          value={stats.total.toString()}
          description="Tous les clients"
          icon={<Users className="h-4 w-4 text-blue-500" />}
        />
        <StatCard
          title="Clients Actifs"
          value={stats.active.toString()}
          description="En activité"
          icon={<Users className="h-4 w-4 text-green-500" />}
        />
        <StatCard
          title="Clients Inactifs"
          value={stats.inactive.toString()}
          description="Sans activité"
          icon={<UserX className="h-4 w-4 text-gray-500" />}
        />
        <StatCard
          title="Nouveaux Clients"
          value={stats.newThisMonth.toString()}
          description="Ce mois-ci"
          icon={<Clock className="h-4 w-4 text-purple-500" />}
        />
      </div>

      <div className="bg-background rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Véhicules</TableHead>
              <TableHead>Dernière visite</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.firstName} {client.lastName}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  {vehicles.filter(v => v.clientId === client.id).length}
                </TableCell>
                <TableCell>
                  {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : 'Jamais'}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddClientDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={(newClient) => {
          console.log('Save client:', newClient);
          setShowAddDialog(false);
        }}
      />
    </div>
  );
};

export default GarageClientsDashboard;
