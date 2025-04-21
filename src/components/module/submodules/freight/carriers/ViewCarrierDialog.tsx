
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Carrier } from "@/types/freight";

interface ViewCarrierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carrier: Carrier | null;
}

const ViewCarrierDialog: React.FC<ViewCarrierDialogProps> = ({ open, onOpenChange, carrier }) => {
  if (!carrier) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détail du Transporteur</DialogTitle>
          <DialogDescription>
            Visualisation des informations du transporteur sélectionné.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="mb-4">
            <span className="font-semibold">Nom :</span> {carrier.name}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Code :</span> {carrier.code}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Type :</span> {carrier.type}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Contact :</span> {carrier.contactName || "-"}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Email :</span> {carrier.contactEmail || "-"}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Téléphone :</span> {carrier.contactPhone || "-"}
          </div>
          <div>
            <span className="font-semibold">Statut :</span> {carrier.active ? "Actif" : "Non actif"}
          </div>
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

export default ViewCarrierDialog;
