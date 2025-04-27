
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Maintenance } from './types';
import { useGarageData } from '@/hooks/garage/useGarageData';

interface MaintenancesTableProps {
  maintenances: Maintenance[];
  onView: (maintenance: Maintenance) => void;
  onEdit: (maintenance: Maintenance) => void;
  onDelete: (maintenance: Maintenance) => void;
}

const MaintenancesTable = ({ 
  maintenances, 
  onView, 
  onEdit, 
  onDelete 
}: MaintenancesTableProps) => {
  const { clients, vehicles } = useGarageData();
  
  // Helper function to get client name
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Client non assigné';
  };

  // Helper function to get vehicle info
  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.name || ''} (${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate})` : 'Véhicule non assigné';
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date non définie';
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Terminé', variant: 'success' as const, className: 'bg-green-100 text-green-800' },
      in_progress: { label: 'En cours', variant: 'warning' as const, className: 'bg-yellow-100 text-yellow-800' },
      scheduled: { label: 'Planifié', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      cancelled: { label: 'Annulé', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
      { label: status, variant: 'default' as const, className: 'bg-gray-100 text-gray-800' };

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Véhicule</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {maintenances.map((maintenance) => (
          <TableRow key={maintenance.id}>
            <TableCell>{formatDate(maintenance.date)}</TableCell>
            <TableCell>{getClientName(maintenance.clientId)}</TableCell>
            <TableCell>{getVehicleInfo(maintenance.vehicleId)}</TableCell>
            <TableCell>{getStatusBadge(maintenance.status)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onView(maintenance)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onEdit(maintenance)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onDelete(maintenance)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MaintenancesTable;
