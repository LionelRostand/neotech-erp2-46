
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteDocument } from '@/hooks/firestore/delete-operations';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

interface DeleteMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenanceId: string | undefined;
}

const DeleteMaintenanceDialog = ({
  open,
  onOpenChange,
  maintenanceId,
}: DeleteMaintenanceDialogProps) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!maintenanceId) {
      toast({
        title: "Erreur",
        description: "ID de maintenance manquant",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteDocument('garage_maintenances', maintenanceId);
      
      toast({
        title: "Succès",
        description: "Maintenance supprimée avec succès",
      });
      
      queryClient.invalidateQueries({ queryKey: ['garage', 'maintenances'] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la maintenance",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Cela supprimera définitivement la maintenance.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMaintenanceDialog;
