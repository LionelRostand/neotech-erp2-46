
import React, { useState } from 'react';
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
import ViewRepairDialog from '../ViewRepairDialog';
import EditRepairDialog from '../EditRepairDialog';
import DeleteRepairDialog from '../DeleteRepairDialog';
import { Repair } from '../../../types/garage-types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RepairsTableProps {
  repairs: Repair[];
}

const RepairsTable = ({ repairs }: RepairsTableProps) => {
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

  const handleUpdate = () => {
    // This will trigger a refetch of the repairs data
    window.location.reload();
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'awaiting_approval': return 'En attente d\'approbation';
      case 'approved': return 'Approuvé';
      case 'in_progress': return 'En cours';
      case 'awaiting_parts': return 'En attente de pièces';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
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
              <TableCell colSpan={8} className="text-center text-gray-500">
                Aucune réparation trouvée
              </TableCell>
            </TableRow>
          ) : (
            repairs.map((repair, index) => (
              <TableRow key={repair.id || index}>
                <TableCell>
                  {repair.date ? format(new Date(repair.date), 'dd/MM/yyyy', { locale: fr }) : ''}
                </TableCell>
                <TableCell>{repair.clientName}</TableCell>
                <TableCell>{repair.vehicleName || repair.vehicleInfo}</TableCell>
                <TableCell>{repair.description}</TableCell>
                <TableCell>{repair.mechanicName}</TableCell>
                <TableCell>{getStatusLabel(repair.status)}</TableCell>
                <TableCell>{repair.progress}%</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(repair)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(repair)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(repair)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
        onUpdate={handleUpdate}
      />

      <DeleteRepairDialog
        repairId={selectedRepair?.id || null}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleUpdate}
      />
    </>
  );
};

export default RepairsTable;
