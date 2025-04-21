
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Container } from "@/types/freight";
import { Button } from "@/components/ui/button";

interface ContainerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container | null;
}

const ContainerDetailsDialog: React.FC<ContainerDetailsDialogProps> = ({
  open,
  onOpenChange,
  container,
}) => {
  if (!container) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Détails du conteneur</DialogTitle>
          <DialogDescription>
            {container.number ? `Conteneur N° ${container.number}` : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <div className="font-semibold">Type:</div>
            <div>{container.type}</div>
          </div>
          <div>
            <div className="font-semibold">Taille:</div>
            <div>{container.size}</div>
          </div>
          <div>
            <div className="font-semibold">Statut:</div>
            <div>{container.status}</div>
          </div>
          <div>
            <div className="font-semibold">Coût:</div>
            <div>
              {typeof container.cost === "number"
                ? `${container.cost.toLocaleString()} €`
                : "-"}
            </div>
          </div>
          <div>
            <div className="font-semibold">Transporteur:</div>
            <div>{container.carrierName}</div>
          </div>
          <div>
            <div className="font-semibold">Origine:</div>
            <div>{container.origin}</div>
          </div>
          <div>
            <div className="font-semibold">Destination:</div>
            <div>{container.destination}</div>
          </div>
          <div>
            <div className="font-semibold">Client:</div>
            <div>{container.client ?? "-"}</div>
          </div>
          <div>
            <div className="font-semibold">Date Départ:</div>
            <div>{container.departureDate ?? "-"}</div>
          </div>
          <div>
            <div className="font-semibold">Date Arrivée:</div>
            <div>{container.arrivalDate ?? "-"}</div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerDetailsDialog;
