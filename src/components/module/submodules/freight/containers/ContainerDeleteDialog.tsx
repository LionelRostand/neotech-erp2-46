
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { Container } from "@/types/freight";

interface ContainerDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container;
  onDeleted?: () => void;
}

const ContainerDeleteDialog: React.FC<ContainerDeleteDialogProps> = ({
  open,
  onOpenChange,
  container,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, COLLECTIONS.FREIGHT.CONTAINERS, container.id));
      
      toast.success("Conteneur supprimé avec succès");
      onDeleted?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la suppression du conteneur:", error);
      toast.error("Erreur lors de la suppression du conteneur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
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

export default ContainerDeleteDialog;
