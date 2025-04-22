
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
