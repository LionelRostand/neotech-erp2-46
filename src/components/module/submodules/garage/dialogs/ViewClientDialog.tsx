
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GarageClient } from '../types/garage-types';

interface ViewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: GarageClient | null;
}

const ViewClientDialog = ({ open, onOpenChange, client }: ViewClientDialogProps) => {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du client</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="font-semibold">Nom</div>
            <div className="col-span-2">{client.firstName} {client.lastName}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="font-semibold">Email</div>
            <div className="col-span-2">{client.email}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="font-semibold">Téléphone</div>
            <div className="col-span-2">{client.phone}</div>
          </div>
          {client.address && (
            <div className="grid grid-cols-3 gap-2">
              <div className="font-semibold">Adresse</div>
              <div className="col-span-2">{client.address}</div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewClientDialog;
