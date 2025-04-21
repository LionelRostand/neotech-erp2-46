
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type FreightClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: FreightClient | null;
  onDelete: () => void;
  deleting: boolean;
};

const FreightClientDeleteDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  client,
  onDelete,
  deleting,
}) => {
  if (!client) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le client ?</DialogTitle>
        </DialogHeader>
        <div>
          Êtes-vous sûr·e de vouloir supprimer le client <b>{client.name}</b>? Cette action est définitive.
        </div>
        <DialogFooter>
          <Button variant="secondary" disabled={deleting} onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onDelete}
            disabled={deleting}
          >
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FreightClientDeleteDialog;
