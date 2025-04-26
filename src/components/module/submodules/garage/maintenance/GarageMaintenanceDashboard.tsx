
import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import StatCard from '@/components/StatCard';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChartBarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddMaintenanceDialog from './AddMaintenanceDialog';

const GarageMaintenanceDashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { maintenances = [], vehicles = [], clients = [] } = useGarageData();

  // Calculate statistics
  const totalMaintenances = maintenances.length;
  const inProgressMaintenances = maintenances.filter(m => m.status === 'in_progress').length;
  const completedMaintenances = maintenances.filter(m => m.status === 'completed').length;
  const pendingMaintenances = maintenances.filter(m => m.status === 'pending').length;

  // Get recent maintenances (last 5)
  const recentMaintenances = [...maintenances]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Get vehicle info
  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : 'N/A';
  };

  // Get client name
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'N/A';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Maintenances</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle maintenance
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Maintenances"
          value={totalMaintenances.toString()}
          icon={<ChartBarIcon className="h-4 w-4 text-gray-500" />}
          description="Nombre total de maintenances"
        />
        <StatCard
          title="En cours"
          value={inProgressMaintenances.toString()}
          icon={<ChartBarIcon className="h-4 w-4 text-blue-500" />}
          description="Maintenances en cours"
        />
        <StatCard
          title="Terminées"
          value={completedMaintenances.toString()}
          icon={<ChartBarIcon className="h-4 w-4 text-green-500" />}
          description="Maintenances terminées"
        />
        <StatCard
          title="En attente"
          value={pendingMaintenances.toString()}
          icon={<ChartBarIcon className="h-4 w-4 text-yellow-500" />}
          description="Maintenances en attente"
        />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Maintenances Récentes</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Coût</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentMaintenances.map((maintenance) => (
              <TableRow key={maintenance.id}>
                <TableCell>
                  {format(new Date(maintenance.date), 'dd MMM yyyy', { locale: fr })}
                </TableCell>
                <TableCell>{getVehicleInfo(maintenance.vehicleId)}</TableCell>
                <TableCell>{getClientName(maintenance.clientId)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${maintenance.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    ${maintenance.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
                    ${maintenance.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  `}>
                    {maintenance.status === 'completed' && 'Terminée'}
                    {maintenance.status === 'in_progress' && 'En cours'}
                    {maintenance.status === 'pending' && 'En attente'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(maintenance.totalCost)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AddMaintenanceDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default GarageMaintenanceDashboard;

