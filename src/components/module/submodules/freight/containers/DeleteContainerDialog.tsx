
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteContainer } from "@/hooks/modules/useContainersFirestore";
import { toast } from "sonner";

interface DeleteContainerDialogProps {
  open: boolean;
  onClose: () => void;
  container: {
    id: string;
    number: string;
  };
}

const DeleteContainerDialog: React.FC<DeleteContainerDialogProps> = ({
  open,
  onClose,
  container,
}) => {
  const deleteContainerMutation = useDeleteContainer();

  const handleDelete = async () => {
    try {
      await deleteContainerMutation.mutateAsync(container.id);
      toast.success("Conteneur supprimé avec succès!");
      onClose();
    } catch (error) {
      console.error("Error deleting container:", error);
      toast.error("Erreur lors de la suppression du conteneur");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le conteneur{" "}
            <span className="font-semibold">{container?.number}</span>? Cette
            action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteContainerMutation.isPending}
          >
            {deleteContainerMutation.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteContainerDialog;
