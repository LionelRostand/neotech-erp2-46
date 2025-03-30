
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TransportVehicle } from '../types/vehicle-types';
import { MapMaintenanceSchedule as MaintenanceSchedule } from '../types';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Wrench } from "lucide-react";

interface MaintenanceScheduleListProps {
  maintenanceSchedules: MaintenanceSchedule[];
  vehicles: TransportVehicle[];
  onAddMaintenance: (vehicle: TransportVehicle | null) => void;
}

const MaintenanceScheduleList: React.FC<MaintenanceScheduleListProps> = ({
  maintenanceSchedules,
  vehicles,
  onAddMaintenance
}) => {
  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.name : "Véhicule inconnu";
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
  };

  const getMaintenanceTypeLabel = (type: string | undefined) => {
    if (!type) return 'Entretien';
    
    switch(type) {
      case 'regular': return 'Entretien régulier';
      case 'repair': return 'Réparation';
      case 'inspection': return 'Inspection';
      default: return type;
    }
  };

  const handleEditMaintenance = (schedule: MaintenanceSchedule) => {
    const vehicle = vehicles.find(v => v.id === schedule.vehicleId);
    if (vehicle) {
      onAddMaintenance(vehicle);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Maintenances programmées</h3>
        <Button 
          onClick={() => onAddMaintenance(null)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Nouvelle maintenance</span>
        </Button>
      </div>
      
      {maintenanceSchedules.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <Wrench className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium mb-2">Aucune maintenance programmée</h4>
          <p className="text-muted-foreground mx-auto max-w-md mb-6">
            Il n'y a pas de maintenance programmée actuellement. Cliquez sur le bouton "Nouvelle maintenance" pour en ajouter une.
          </p>
          <Button
            onClick={() => onAddMaintenance(null)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Nouvelle maintenance</span>
          </Button>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date début</TableHead>
                <TableHead>Date fin</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Technicien</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{getVehicleName(schedule.vehicleId)}</TableCell>
                  <TableCell>{getMaintenanceTypeLabel(schedule.type)}</TableCell>
                  <TableCell>{schedule.startDate ? formatDate(schedule.startDate) : '-'}</TableCell>
                  <TableCell>{schedule.endDate ? formatDate(schedule.endDate) : '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">{schedule.description || '-'}</TableCell>
                  <TableCell>{schedule.technician || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditMaintenance(schedule)}
                    >
                      Modifier
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MaintenanceScheduleList;
