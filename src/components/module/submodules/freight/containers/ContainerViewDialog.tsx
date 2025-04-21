
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Container } from "@/types/freight";

interface ContainerViewDialogProps {
  container: Container;
  open: boolean;
  onClose: () => void;
}

const ContainerViewDialog: React.FC<ContainerViewDialogProps> = ({
  container,
  open,
  onClose,
}) => {
  const calculateTotalCost = (costs: any[] = []) => {
    return costs.reduce((total, cost) => total + Number(cost.amount), 0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails du conteneur</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm">Numéro</h3>
              <p>{container.number}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Type</h3>
              <p>{container.type}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Client</h3>
              <p>{container.client}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Status</h3>
              <p>{container.status}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Destination</h3>
              <p>{container.destination}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Coût Total</h3>
              <p>
                {container.costs && container.costs.length > 0
                  ? `${calculateTotalCost(container.costs).toLocaleString('fr-FR')} €`
                  : '0 €'}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerViewDialog;
