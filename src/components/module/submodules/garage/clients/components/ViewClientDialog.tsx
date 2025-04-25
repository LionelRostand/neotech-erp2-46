
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GarageClient } from '../../types/garage-types';

interface ViewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: GarageClient | null;
}

const ViewClientDialog = ({
  open,
  onOpenChange,
  client
}: ViewClientDialogProps) => {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du client</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="font-medium">Nom</p>
            <p className="col-span-2">{client.firstName} {client.lastName}</p>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="font-medium">Email</p>
            <p className="col-span-2">{client.email}</p>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="font-medium">Téléphone</p>
            <p className="col-span-2">{client.phone}</p>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="font-medium">Adresse</p>
            <p className="col-span-2">{client.address || '-'}</p>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="font-medium">Notes</p>
            <p className="col-span-2">{client.notes || '-'}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewClientDialog;
