
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
  const findClient = (clientId: string) => clients.find((c) => c.id === clientId) || { name: "-", id: clientId };
  const findContainer = (containerId: string) => containers.find((c) => c.id === containerId) || { number: "-", id: containerId };

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
              ) : (shipments.map((shipment: any) => (
                <TableRow key={shipment.id || shipment.reference}>
                  <TableCell>{shipment.reference}</TableCell>
                  <TableCell>{findClient(shipment.customer)?.name || "-"}</TableCell>
                  <TableCell>{findContainer(shipment.containerId)?.number || "-"}</TableCell>
                  <TableCell>
                    {shipment.totalPrice ?
                      shipment.totalPrice.toLocaleString("fr-FR", { style: "currency", currency: "EUR" }) :
                      "-"}
                  </TableCell>
                  <TableCell>{shipment.status || "-"}</TableCell>
                  <TableCell>{shipment.scheduledDate ? new Date(shipment.scheduledDate).toLocaleDateString() : "-"}</TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreightAccountingSummaryDialog;
