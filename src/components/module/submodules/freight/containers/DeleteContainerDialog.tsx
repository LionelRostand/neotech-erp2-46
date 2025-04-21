
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

const DeleteContainerDialog = ({ open, onClose, container }: { open: boolean, onClose: () => void, container: any }) => {
  const [deleting, setDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!container?.id) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, COLLECTIONS.FREIGHT.CONTAINERS, container.id));
      toast.success("Conteneur supprimé !");
      onClose();
    } catch (err: any) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le Conteneur</DialogTitle>
        </DialogHeader>
        <div>
          Êtes-vous sûr de vouloir supprimer le conteneur <strong>{container?.number}</strong> ?
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" type="button" onClick={onClose} disabled={deleting}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteContainerDialog;
