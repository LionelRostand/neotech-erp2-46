
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Container } from "@/types/freight";
import { deleteDocument } from "@/hooks/firestore/delete-operations";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container | null;
  onDeleted?: () => void;
}

const ContainerDeleteDialog: React.FC<Props> = ({ open, onOpenChange, container, onDeleted }) => {
  const [submitting, setSubmitting] = React.useState(false);

  const handleDelete = async () => {
    if (!container?.id) return;
    
    setSubmitting(true);
    try {
      await deleteDocument("freight-containers", container.id);
      toast.success("Conteneur supprimé !");
      onDeleted?.();
    } catch (error) {
      toast.error("Erreur lors de la suppression.");
      console.error(error);
    } finally {
      setSubmitting(false);
      onOpenChange(false);
    }
  };

  if (!container) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le conteneur <strong>{container.number}</strong> ?
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={submitting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {submitting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ContainerDeleteDialog;
