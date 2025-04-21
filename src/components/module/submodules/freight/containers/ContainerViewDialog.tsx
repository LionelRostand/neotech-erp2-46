
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Container } from "@/types/freight";

interface ContainerViewDialogProps {
  open: boolean;
  onClose: () => void;
  container: Container | null;
}

const ContainerViewDialog: React.FC<ContainerViewDialogProps> = ({ open, onClose, container }) => {
  if (!container) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails du conteneur</DialogTitle>
          <DialogDescription>
            Informations du conteneur <span className="font-semibold">{container.number}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2 text-sm">
          <div><span className="font-medium">Numéro :</span> {container.number}</div>
          <div><span className="font-medium">Type :</span> {container.type}</div>
          <div><span className="font-medium">Taille :</span> {container.size}</div>
          <div><span className="font-medium">Client :</span> {container.client}</div>
          <div><span className="font-medium">Statut :</span> {container.status}</div>
          <div><span className="font-medium">Origine :</span> {container.origin}</div>
          <div><span className="font-medium">Destination :</span> {container.destination}</div>
          <div><span className="font-medium">Date départ :</span> {container.departureDate}</div>
          <div><span className="font-medium">Date arrivée :</span> {container.arrivalDate}</div>
          <div><span className="font-medium">Localisation :</span> {container.location}</div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ContainerViewDialog;
