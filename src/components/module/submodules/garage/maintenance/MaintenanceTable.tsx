
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GarageMaintenance } from '@/types/module-types';
import MaintenanceActions from './MaintenanceActions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MaintenanceTableProps {
  maintenances: GarageMaintenance[];
  onView: (maintenance: GarageMaintenance) => void;
  onEdit: (maintenance: GarageMaintenance) => void;
  onDelete: (maintenance: GarageMaintenance) => void;
}

const MaintenanceTable = ({ 
  maintenances,
  onView,
  onEdit,
  onDelete
}: MaintenanceTableProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Véhicule</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Coût Total</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {maintenances.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              Aucune maintenance trouvée
            </TableCell>
          </TableRow>
        ) : (
          maintenances.map((maintenance) => (
            <TableRow key={maintenance.id}>
              <TableCell>{formatDate(maintenance.date)}</TableCell>
              <TableCell>{maintenance.clientName}</TableCell>
              <TableCell>{maintenance.vehicleName}</TableCell>
              <TableCell>{maintenance.description}</TableCell>
              <TableCell>{maintenance.status}</TableCell>
              <TableCell>{maintenance.totalCost}€</TableCell>
              <TableCell>
                <MaintenanceActions
                  maintenance={maintenance}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default MaintenanceTable;
