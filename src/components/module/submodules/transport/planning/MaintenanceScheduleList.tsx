
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CarFront, Plus, Wrench, FileCheck, FileQuestion } from "lucide-react";
import { TransportVehicle, VehicleMaintenanceSchedule as MaintenanceSchedule } from '../types';

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
  // Get vehicle name by ID
  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.name : "Véhicule inconnu";
  };
  
  // Get icon based on maintenance type
  const getMaintenanceIcon = (type: string) => {
    switch (type) {
      case 'regular':
        return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'repair':
        return <CarFront className="h-4 w-4 text-red-500" />;
      case 'inspection':
        return <FileCheck className="h-4 w-4 text-green-500" />;
      default:
        return <FileQuestion className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get badge based on maintenance type
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'regular':
        return <Badge className="bg-blue-500">Entretien régulier</Badge>;
      case 'repair':
        return <Badge className="bg-red-500">Réparation</Badge>;
      case 'inspection':
        return <Badge className="bg-green-500">Inspection</Badge>;
      default:
        return <Badge>Autre</Badge>;
    }
  };
  
  // Format date from YYYY-MM-DD to local date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { dateStyle: 'long' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={() => onAddMaintenance(null)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Nouvelle maintenance</span>
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Véhicule</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date début</TableHead>
              <TableHead>Date fin</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Prestataire</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceSchedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  Aucune maintenance planifiée
                </TableCell>
              </TableRow>
            ) : (
              maintenanceSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <CarFront size={16} />
                      <span>{getVehicleName(schedule.vehicleId)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMaintenanceIcon(schedule.type)}
                      {getTypeBadge(schedule.type)}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(schedule.startDate)}</TableCell>
                  <TableCell>{formatDate(schedule.endDate)}</TableCell>
                  <TableCell>{schedule.description}</TableCell>
                  <TableCell>{schedule.technician || "Non assigné"}</TableCell>
                  <TableCell>
                    {schedule.completed ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Terminé
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                        Planifié
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          const vehicle = vehicles.find(v => v.id === schedule.vehicleId);
                          if (vehicle) {
                            onAddMaintenance(vehicle);
                          }
                        }}
                      >
                        Modifier
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        Annuler
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MaintenanceScheduleList;
