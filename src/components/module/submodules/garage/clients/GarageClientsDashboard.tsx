
import React from 'react';
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { Button } from '@/components/ui/button';
import { Plus, UserPlus } from 'lucide-react';
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
import StatCard from '@/components/StatCard';

const GarageClientsDashboard = () => {
  const { clients, loading, refetchClients } = useGarageClients();
  const [showAddDialog, setShowAddDialog] = React.useState(false);

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
    newThisMonth: clients.filter(c => {
      const createdDate = new Date(c.createdAt);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() &&
             createdDate.getFullYear() === now.getFullYear();
    }).length
  };

  const handleClientAdded = async () => {
    await refetchClients();
    setShowAddDialog(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clients"
          value={stats.total.toString()}
          description="Tous les clients"
          trend="up"
        />
        <StatCard
          title="Clients Actifs"
          value={stats.active.toString()}
          description="En activité"
          trend="up"
        />
        <StatCard
          title="Clients Inactifs"
          value={stats.inactive.toString()}
          description="Sans activité"
          trend="down"
        />
        <StatCard
          title="Nouveaux Clients"
          value={stats.newThisMonth.toString()}
          description="Ce mois-ci"
          trend="up"
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
                  <Badge variant="secondary">
                    {client.vehicles.length}
                  </Badge>
                </TableCell>
                <TableCell>
                  {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : 'Jamais'}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={client.status === 'active' ? 'default' : 'secondary'}
                  >
                    {client.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddClientDialog 
        isOpen={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
};

export default GarageClientsDashboard;
