
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Shipment } from "@/hooks/freight/useFreightShipments";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageData: Shipment | null;
}

const PackageDetailsDialog: React.FC<Props> = ({ open, onOpenChange, packageData }) => {
  if (!packageData) return null;

  const formatDate = (dateValue: any): string => {
    if (!dateValue) return "-";
    
    // Handle Firebase timestamp (object with seconds and nanoseconds)
    if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue) {
      try {
        const date = new Date(dateValue.seconds * 1000);
        return format(date, "dd MMM yyyy", { locale: fr });
      } catch (error) {
        console.error("Error formatting timestamp:", error);
        return "Date invalide";
      }
    }
    
    // Handle string dates
    if (typeof dateValue === 'string') {
      try {
        return format(new Date(dateValue), "dd MMM yyyy", { locale: fr });
      } catch (error) {
        console.error("Error formatting date string:", error);
        return dateValue;
      }
    }
    
    // Handle Date objects
    if (dateValue instanceof Date) {
      try {
        return format(dateValue, "dd MMM yyyy", { locale: fr });
      } catch (error) {
        console.error("Error formatting Date object:", error);
        return "Date invalide";
      }
    }
    
    return "Format de date non reconnu";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du colis</DialogTitle>
          <DialogDescription>Référence : {packageData.reference}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <div><span className="font-medium">Client :</span> {packageData.customerName || "-"}</div>
          <div><span className="font-medium">Statut :</span> {packageData.status}</div>
          <div><span className="font-medium">Origine :</span> {packageData.origin || "-"}</div>
          <div><span className="font-medium">Destination :</span> {packageData.destination || "-"}</div>
          <div><span className="font-medium">Numéro de suivi :</span> {packageData.trackingNumber || "-"}</div>
          <div><span className="font-medium">Description :</span> {packageData.description || "-"}</div>
          <div><span className="font-medium">Date de création :</span> {formatDate(packageData.createdAt)}</div>
          <div><span className="font-medium">Poids total :</span> {packageData.weight} {packageData.weightUnit}</div>
          <div><span className="font-medium">Transporteur :</span> {packageData.carrierName || "-"}</div>
          <div><span className="font-medium">Documents :</span> {packageData.documents?.length || 0} document(s)</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageDetailsDialog;
