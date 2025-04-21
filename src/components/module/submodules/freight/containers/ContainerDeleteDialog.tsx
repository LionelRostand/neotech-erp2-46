
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Container } from "@/types/freight";
import { toast } from "sonner";

interface ContainerDeleteDialogProps {
  container: Container;
  open: boolean;
  onClose: () => void;
}

const ContainerDeleteDialog: React.FC<ContainerDeleteDialogProps> = ({
  container,
  open,
  onClose,
}) => {
  const handleDelete = async () => {
    try {
      // Here would be the code to delete the container from Firestore
      toast.success("Conteneur supprimé avec succès");
      onClose();
    } catch (error) {
      console.error("Error deleting container:", error);
      toast.error("Erreur lors de la suppression du conteneur");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Supprimer le conteneur</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le conteneur {container.number} ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerDeleteDialog;
