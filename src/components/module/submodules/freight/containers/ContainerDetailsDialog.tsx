
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ContainerStatusBadge, { getStatusLabel } from "./ContainerStatusBadge";
import { Container } from "@/types/freight";

interface ContainerDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  container: Container | null;
}

const ContainerDetailsDialog: React.FC<ContainerDetailsDialogProps> = ({
  open,
  onClose,
  container,
}) => {
  if (!container) return null;

  function formatDate(s: string) {
    if (!s) return "";
    try {
      return new Date(s).toLocaleDateString("fr-FR");
    } catch {
      return s;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du conteneur {container.number}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <h3 className="font-semibold text-gray-500 text-xs">Numéro</h3>
            <p>{container.number}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500 text-xs">Type</h3>
            <p>{container.type}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500 text-xs">Statut</h3>
            <ContainerStatusBadge status={container.status} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-500 text-xs">Client</h3>
            <p>{container.client}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500 text-xs">Transporteur</h3>
            <p>{container.carrierName}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500 text-xs">Origine</h3>
            <p>{container.origin}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500 text-xs">Destination</h3>
            <p>{container.destination}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500 text-xs">Localisation</h3>
            <p>{container.location}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-500 text-xs">Départ</h3>
            <p>{formatDate(container.departureDate || container.departure || "")}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500 text-xs">Arrivée</h3>
            <p>{formatDate(container.arrivalDate || container.arrival || "")}</p>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={onClose} type="button">Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerDetailsDialog;
