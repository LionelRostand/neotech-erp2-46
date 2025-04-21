
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";

interface FreightAccountingSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipments: any[];
  clients: any[];
  containers: any[];
}

const FreightAccountingSummaryDialog: React.FC<FreightAccountingSummaryDialogProps> = ({
  open, onOpenChange, shipments, clients, containers
}) => {
  // Helpers
  const findClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client && typeof client === 'object' ? client : { name: "-", id: clientId };
  };
  
  const findContainer = (containerId: string) => {
    const container = containers.find((c) => c.id === containerId);
    return container && typeof container === 'object' ? container : { number: "-", id: containerId };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Récapitulatif des coûts des expéditions</DialogTitle>
          <DialogDescription>
            Références croisées entre Expéditions, Conteneurs et Clients
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Conteneur</TableHead>
                <TableHead>Coût</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Pas d'expéditions à afficher
                  </TableCell>
                </TableRow>
              ) : (shipments.map((shipment: any) => {
                const client = findClient(shipment.customer);
                const container = findContainer(shipment.containerId);
                
                return (
                  <TableRow key={shipment.id || shipment.reference}>
                    <TableCell>{shipment.reference}</TableCell>
                    <TableCell>{client.name || "-"}</TableCell>
                    <TableCell>{container.number || "-"}</TableCell>
                    <TableCell>
                      {shipment.totalPrice ?
                        shipment.totalPrice.toLocaleString("fr-FR", { style: "currency", currency: "EUR" }) :
                        "-"}
                    </TableCell>
                    <TableCell>{shipment.status || "-"}</TableCell>
                    <TableCell>{shipment.scheduledDate ? new Date(shipment.scheduledDate).toLocaleDateString() : "-"}</TableCell>
                  </TableRow>
                );
              }))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreightAccountingSummaryDialog;
