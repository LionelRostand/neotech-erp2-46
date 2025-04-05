import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MaintenanceSchedule, TransportVehicle } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MaintenanceTableProps {
  maintenanceSchedules: MaintenanceSchedule[];
  vehicles: TransportVehicle[];
}

const MaintenanceTable: React.FC<MaintenanceTableProps> = ({ 
  maintenanceSchedules,
  vehicles
}) => {
  const getVehicleName = (vehicleId: string): string => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.name} (${vehicle.licensePlate})` : 'Véhicule inconnu';
  };

  const getMaintenanceTypeLabel = (type: string): string => {
    switch (type) {
      case 'regular': return 'Entretien régulier';
      case 'repair': return 'Réparation';
      case 'inspection': return 'Inspection';
      default: return type;
    }
  };

  const getStatusBadge = (schedule: MaintenanceSchedule) => {
    const today = new Date();
    const scheduledDate = new Date(schedule.scheduledDate);
    
    if (schedule.status === 'completed' || schedule.completed) {
      return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
    } else if (scheduledDate < today) {
      return <Badge variant="destructive">En retard</Badge>;
    } else {
      const diffTime = Math.abs(scheduledDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) {
        return <Badge className="bg-yellow-100 text-yellow-800">Bientôt</Badge>;
      } else {
        return <Badge className="bg-blue-100 text-blue-800">Planifié</Badge>;
      }
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'PPP', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  return (
    <div className="overflow-x-auto">
      {maintenanceSchedules.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Aucune maintenance programmée</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Véhicule</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date programmée</TableHead>
              <TableHead>Technicien</TableHead>
              <TableHead className="w-[120px]">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{getVehicleName(schedule.vehicleId)}</TableCell>
                <TableCell>{getMaintenanceTypeLabel(schedule.type)}</TableCell>
                <TableCell>{schedule.description}</TableCell>
                <TableCell>{formatDate(schedule.scheduledDate)}</TableCell>
                <TableCell>{schedule.technician || schedule.technicianAssigned || '—'}</TableCell>
                <TableCell>{getStatusBadge(schedule)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default MaintenanceTable;
