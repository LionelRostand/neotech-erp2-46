
import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { Shipment } from '@/types/freight';

interface ShipmentDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment;
  onConfirm: () => void;
  isDeleting?: boolean;
}

const ShipmentDeleteDialog: React.FC<ShipmentDeleteDialogProps> = ({ 
  isOpen, 
  onClose, 
  shipment, 
  onConfirm,
  isDeleting = false
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette expédition?</AlertDialogTitle>
          <AlertDialogDescription>
            L'expédition <strong>{shipment.reference}</strong> sera définitivement supprimée.
            Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShipmentDeleteDialog;
