
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { Route } from "@/types/freight";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route: Route | null;
  onDelete: () => Promise<void>;
  deleting: boolean;
};

const FreightRouteDeleteDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  route,
  onDelete,
  deleting,
}) => {
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
            onClick={onDelete}
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
