
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
import { Shipment } from '@/types/freight';

interface ShipmentDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment;
  onConfirm: () => void;
}

const ShipmentDeleteDialog: React.FC<ShipmentDeleteDialogProps> = ({ 
  isOpen, 
  onClose, 
  shipment, 
  onConfirm 
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
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShipmentDeleteDialog;
