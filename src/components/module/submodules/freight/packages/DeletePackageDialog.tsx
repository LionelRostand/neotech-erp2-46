
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { deleteShipment } from '@/components/module/submodules/freight/services/shipmentService';
import { toast } from 'sonner';
import { Shipment } from '@/hooks/freight/useFreightShipments';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DeletePackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: Shipment | null;
  onDeleted: () => void;
}

const DeletePackageDialog: React.FC<DeletePackageDialogProps> = ({ 
  open, 
  onOpenChange, 
  shipment, 
  onDeleted 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!shipment) return;
    
    setIsDeleting(true);
    try {
      await deleteShipment(shipment.id);
      toast.success("Colis supprimé avec succès");
      onDeleted();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la suppression du colis:", error);
      toast.error("Erreur lors de la suppression du colis");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to safely format dates
  const formatDate = (dateValue: any): string => {
    if (!dateValue) return '';
    
    // Check if it's a Firebase timestamp (has seconds and nanoseconds)
    if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue) {
      try {
        const date = new Date(dateValue.seconds * 1000);
        return format(date, 'dd MMM yyyy', { locale: fr });
      } catch (error) {
        console.error("Error formatting timestamp:", error);
        return 'Date invalide';
      }
    }
    
    // Handle string dates
    if (typeof dateValue === 'string') {
      try {
        return format(new Date(dateValue), 'dd MMM yyyy', { locale: fr });
      } catch (error) {
        console.error("Error formatting date string:", error);
        return dateValue;
      }
    }
    
    // Handle Date objects
    if (dateValue instanceof Date) {
      try {
        return format(dateValue, 'dd MMM yyyy', { locale: fr });
      } catch (error) {
        console.error("Error formatting Date object:", error);
        return 'Date invalide';
      }
    }
    
    return 'Date inconnue';
  };

  if (!shipment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer le colis</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le colis <strong>{shipment.reference}</strong> ?
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Client:</span> {shipment.customerName || "-"}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Date de création:</span> {formatDate(shipment.createdAt)}
            </p>
            {shipment.carrierName && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Transporteur:</span> {shipment.carrierName}
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePackageDialog;
