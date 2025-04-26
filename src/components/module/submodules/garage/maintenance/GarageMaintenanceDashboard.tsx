
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Wrench, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { format, isValid } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import AddMaintenanceDialog from './AddMaintenanceDialog';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const GarageMaintenanceDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { maintenances = [], vehicles, clients, mechanics, isLoading } = useGarageData();

  const formatDateSafely = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (!isValid(date)) {
        return 'Date invalide';
      }
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Error formatting date:', error, dateStr);
      return 'Date invalide';
    }
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : vehicleId;
  };

  const getClientInfo = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : clientId;
  };

  const getMechanicInfo = (mechanicId: string) => {
    const mechanic = mechanics.find(m => m.id === mechanicId);
    return mechanic ? `${mechanic.firstName} ${mechanic.lastName}` : mechanicId;
  };

  const scheduledCount = maintenances.filter(m => m.status === 'scheduled').length;
  const inProgressCount = maintenances.filter(m => m.status === 'in_progress').length;
  const completedCount = maintenances.filter(m => m.status === 'completed').length;
  const urgentCount = maintenances.filter(m => m.status === 'scheduled' && new Date(m.date) < new Date()).length;

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenances</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Maintenance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Programmées"
          value={scheduledCount.toString()}
          icon={<Clock className="h-6 w-6 text-blue-600" />}
          description="Maintenances à venir"
          className="bg-blue-50"
        />
        <StatCard
          title="En cours"
          value={inProgressCount.toString()}
          icon={<Wrench className="h-6 w-6 text-yellow-600" />}
          description="Maintenances en cours"
          className="bg-yellow-50"
        />
        <StatCard
          title="Terminées"
          value={completedCount.toString()}
          icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          description="Maintenances complétées"
          className="bg-green-50"
        />
        <StatCard
          title="Urgentes"
          value={urgentCount.toString()}
          icon={<AlertCircle className="h-6 w-6 text-red-600" />}
          description="Nécessitent attention"
          className="bg-red-50"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Liste des maintenances</h2>
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Mécanicien</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Coût Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Aucune maintenance trouvée
                  </TableCell>
                </TableRow>
              ) : (
                maintenances.map((maintenance) => (
                  <TableRow key={maintenance.id}>
                    <TableCell>{formatDateSafely(maintenance.date)}</TableCell>
                    <TableCell>{getVehicleInfo(maintenance.vehicleId)}</TableCell>
                    <TableCell>{getClientInfo(maintenance.clientId)}</TableCell>
                    <TableCell>{getMechanicInfo(maintenance.mechanicId)}</TableCell>
                    <TableCell>
                      {maintenance.status === 'scheduled' && 'Programmée'}
                      {maintenance.status === 'in_progress' && 'En cours'}
                      {maintenance.status === 'completed' && 'Terminée'}
                      {maintenance.status === 'cancelled' && 'Annulée'}
                      {!maintenance.status && 'Non défini'}
                    </TableCell>
                    <TableCell>{maintenance.totalCost}€</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddMaintenanceDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageMaintenanceDashboard;
