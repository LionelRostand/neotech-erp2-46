
import React from "react";
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
import { Route } from "@/types/freight/route-types";
import { deleteDocument } from "@/hooks/firestore/delete-operations";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { toast } from 'sonner';
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route: Route | null;
  onSuccess: () => void;
};

const FreightRouteDeleteDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  route,
  onSuccess,
}) => {
  const [deleting, setDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!route) return;
    
    try {
      setDeleting(true);
      await deleteDocument(COLLECTIONS.FREIGHT.ROUTES, route.id);
      toast.success('Route supprimée avec succès');
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la route');
    } finally {
      setDeleting(false);
    }
  };

  if (!route) return null;
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la route ?</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr·e de vouloir supprimer la route <b>{route.name}</b> ? Cette action est définitive.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FreightRouteDeleteDialog;
