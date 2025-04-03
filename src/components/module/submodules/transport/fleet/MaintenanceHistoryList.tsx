
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Wrench, CarFront, FileCheck, FileQuestion, Edit, Plus } from "lucide-react";
import { MaintenanceRecord } from '../types/vehicle-types';

interface MaintenanceHistoryListProps {
  maintenanceRecords: MaintenanceRecord[];
  vehicleName: string;
}

const MaintenanceHistoryList: React.FC<MaintenanceHistoryListProps> = ({
  maintenanceRecords,
  vehicleName
}) => {
  // Format date from YYYY-MM-DD to local date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { dateStyle: 'long' });
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Historique de maintenance</h3>
        <Button size="sm" className="flex items-center gap-2">
          <Plus size={16} />
          <span>Ajouter une entrée</span>
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Coût (€)</TableHead>
              <TableHead>Prestataire</TableHead>
              <TableHead>Prochain entretien</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Aucun historique de maintenance pour {vehicleName}
                </TableCell>
              </TableRow>
            ) : (
              maintenanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMaintenanceIcon(record.type)}
                      {getTypeBadge(record.type)}
                    </div>
                  </TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell>{record.cost} €</TableCell>
                  <TableCell>{record.provider}</TableCell>
                  <TableCell>
                    {record.nextMaintenance ? formatDate(record.nextMaintenance) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">Voir les détails</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
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

export default MaintenanceHistoryList;
