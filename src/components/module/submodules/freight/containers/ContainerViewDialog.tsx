
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Container } from "@/types/freight";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container | null;
}

const ContainerViewDialog: React.FC<Props> = ({ open, onOpenChange, container }) => {
  if (!container) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détail du conteneur</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p><b>Numéro :</b> {container.number}</p>
          <p><b>Type :</b> {container.type}</p>
          <p><b>Taille :</b> {container.size}</p>
          <p><b>Statut :</b> {container.status}</p>
          <p><b>Transporteur :</b> {container.carrierName}</p>
          <p><b>Origine :</b> {container.origin}</p>
          <p><b>Destination :</b> {container.destination}</p>
          <p><b>Date départ :</b> {container.departureDate}</p>
          <p><b>Date arrivée :</b> {container.arrivalDate}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerViewDialog;
