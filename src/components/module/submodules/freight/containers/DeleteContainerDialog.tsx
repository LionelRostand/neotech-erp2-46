
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  containerNumber?: string;
}

const DeleteContainerDialog: React.FC<DeleteContainerDialogProps> = ({
  open,
  onOpenChange,
  onDelete,
  containerNumber,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="h-5 w-5" />
          Supprimer le conteneur
        </DialogTitle>
        <DialogDescription>
          Êtes-vous sûr de vouloir supprimer le conteneur
          {containerNumber ? <> <span className="font-semibold">{containerNumber}</span></> : ""} ?
          Cette action est irréversible.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2 sm:justify-end">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Annuler
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => onDelete()}
        >
          Supprimer définitivement
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteContainerDialog;
