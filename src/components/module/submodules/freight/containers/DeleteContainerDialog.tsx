
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDeleteContainer } from "@/hooks/modules/useContainersFirestore";
import type { Container } from "@/types/freight";

interface ContainerDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  container: Container;
  onConfirm?: (containerId: string) => void;
}

const DeleteContainerDialog: React.FC<ContainerDeleteDialogProps> = ({
  open,
  onClose,
  container,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const deleteContainer = useDeleteContainer();

  const handleDelete = async () => {
    if (!container || !container.id) return;
    
    setLoading(true);
    try {
      await deleteContainer.mutateAsync(container.id);
      toast.success("Conteneur supprimé avec succès");
      if (onConfirm) {
        onConfirm(container.id);
      }
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression du conteneur:", error);
      toast.error("Erreur lors de la suppression du conteneur");
    } finally {
      setLoading(false);
    }
  };

  if (!container) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le conteneur <strong>{container.number}</strong>? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mt-2">
          <p className="text-amber-800 text-sm font-medium">
            Tous les articles et coûts liés à ce conteneur seront également supprimés.
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteContainerDialog;
