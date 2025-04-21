
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
};

const FreightClientViewDialog: React.FC<Props> = ({ open, onOpenChange, client }) => {
  if (!client) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détail du client</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p><b>Nom :</b> {client.name}</p>
          <p><b>Email :</b> {client.email}</p>
          <p><b>Téléphone :</b> {client.phone}</p>
          <p><b>Adresse :</b> {client.address}</p>
          {client.notes && <p><b>Notes :</b> {client.notes}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FreightClientViewDialog;
