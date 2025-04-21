
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Container } from "@/types/freight";
import { toast } from "sonner";
import { useDeleteContainer } from "@/hooks/modules/useContainersFirestore";

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
  const [loading, setLoading] = useState(false);
  const deleteContainer = useDeleteContainer();

  const handleDelete = async () => {
    if (!container || !container.id) {
      toast.error("Impossible de supprimer: ID de conteneur manquant");
      return;
    }
    
    setLoading(true);
    try {
      await deleteContainer.mutateAsync(container.id);
      toast.success("Conteneur supprimé avec succès");
      onClose();
    } catch (error) {
      console.error("Error deleting container:", error);
      toast.error("Erreur lors de la suppression du conteneur");
    } finally {
      setLoading(false);
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
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mt-2">
          <p className="text-amber-800 text-sm font-medium">
            Tous les articles et coûts liés à ce conteneur seront également supprimés.
          </p>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Suppression en cours..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerDeleteDialog;
