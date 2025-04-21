
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
  // Fonction pour calculer le coût total
  const calculateTotalCost = (costs: any[] = []) => {
    return costs.reduce((total, cost) => total + Number(cost.amount), 0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails du conteneur {container.number}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Numéro</p>
            <p>{container.number}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Type</p>
            <p>{container.type}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Client</p>
            <p>{container.client}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Statut</p>
            <p>{container.status}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Destination</p>
            <p>{container.destination}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Coût Total</p>
            <p className="font-semibold">
              {container.costs && container.costs.length > 0 
                ? `${calculateTotalCost(container.costs).toLocaleString('fr-FR')} €` 
                : '0 €'}
            </p>
          </div>
        </div>

        {container.costs && container.costs.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">Détail des coûts</h3>
            <div className="bg-gray-50 p-3 rounded border">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2 text-xs font-medium text-gray-500">Description</th>
                    <th className="pb-2 text-xs font-medium text-gray-500">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {container.costs.map((cost, index) => (
                    <tr key={index}>
                      <td className="py-1">{cost.description}</td>
                      <td className="py-1">{Number(cost.amount).toLocaleString('fr-FR')} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerViewDialog;
