
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Repair } from '../../../types/garage-types';
import RepairsTableActions from './RepairsTableActions';
import ViewRepairDialog from '../ViewRepairDialog';
import EditRepairDialog from '../EditRepairDialog';
import DeleteRepairDialog from '../DeleteRepairDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RepairsTableProps {
  repairs: Repair[];
  onRepairModified: () => void;
}

const RepairsTable = ({ repairs, onRepairModified }: RepairsTableProps) => {
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleView = (repair: Repair) => {
    setSelectedRepair(repair);
    setViewDialogOpen(true);
  };

  const handleEdit = (repair: Repair) => {
    setSelectedRepair(repair);
    setEditDialogOpen(true);
  };

  const handleDelete = (repair: Repair) => {
    setSelectedRepair(repair);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteComplete = () => {
    // Make sure onRepairModified is a function before calling it
    if (typeof onRepairModified === 'function') {
      onRepairModified();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Mécanicien</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Progression</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {repairs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                Aucune réparation trouvée
              </TableCell>
            </TableRow>
          ) : (
            repairs.map((repair) => (
              <TableRow key={repair.id}>
                <TableCell>{formatDate(repair.date)}</TableCell>
                <TableCell>{repair.clientName}</TableCell>
                <TableCell>{repair.vehicleName || repair.vehicleInfo}</TableCell>
                <TableCell>{repair.description}</TableCell>
                <TableCell>{repair.mechanicName}</TableCell>
                <TableCell>{repair.status}</TableCell>
                <TableCell>{repair.progress}%</TableCell>
                <TableCell>
                  <RepairsTableActions
                    repair={repair}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ViewRepairDialog
        repair={selectedRepair}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <EditRepairDialog
        repair={selectedRepair}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={onRepairModified}
      />

      <DeleteRepairDialog
        repairId={selectedRepair?.id ?? null}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDeleteComplete}
      />
    </>
  );
};

export default RepairsTable;
