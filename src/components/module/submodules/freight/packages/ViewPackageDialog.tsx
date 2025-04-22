
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Shipment } from "@/types/freight";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageData: Shipment | null;
}

const ViewPackageDialog: React.FC<Props> = ({ open, onOpenChange, packageData }) => {
  if (!packageData) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "dd MMM yyyy", { locale: fr });
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du colis</DialogTitle>
          <DialogDescription>Référence : {packageData.reference}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <div><span className="font-medium">Client :</span> {packageData.customer}</div>
          <div><span className="font-medium">Statut :</span> {packageData.status}</div>
          <div><span className="font-medium">Numéro de suivi :</span> {packageData.trackingNumber || "-"}</div>
          <div><span className="font-medium">Origine :</span> {packageData.origin}</div>
          <div><span className="font-medium">Destination :</span> {packageData.destination}</div>
          <div><span className="font-medium">Date prévue :</span> {formatDate(packageData.scheduledDate)}</div>
          <div><span className="font-medium">Poids total :</span> {packageData.totalWeight} kg</div>
          <div><span className="font-medium">Prix total :</span> {packageData.totalPrice ? `${packageData.totalPrice} €` : "-"}</div>
          <div><span className="font-medium">Notes :</span> {packageData.notes || "-"}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPackageDialog;
