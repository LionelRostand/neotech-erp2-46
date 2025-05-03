
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { deleteTimeSheet } from './services/timesheetService';
import { TimeReport } from '@/types/timesheet';

interface DeleteTimeSheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeSheet: TimeReport;
  onSuccess: () => void;
}

const DeleteTimeSheetDialog: React.FC<DeleteTimeSheetDialogProps> = ({
  open,
  onOpenChange,
  timeSheet,
  onSuccess
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!timeSheet.id) return;

    try {
      setIsDeleting(true);
      await deleteTimeSheet(timeSheet.id);
      toast.success("Feuille de temps supprimée avec succès");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de la feuille de temps:", error);
      toast.error("Échec de la suppression de la feuille de temps");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la feuille de temps</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cette feuille de temps pour {timeSheet.employeeName} ?
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTimeSheetDialog;
