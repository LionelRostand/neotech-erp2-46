
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  discount: number;
  validUntil: string;
  conditions: string;
  isActive: boolean;
}

interface DeleteOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: SpecialOffer;
  onDelete: () => void;
}

const DeleteOfferDialog: React.FC<DeleteOfferDialogProps> = ({
  open,
  onOpenChange,
  offer,
  onDelete
}) => {
  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Supprimer l'offre</DialogTitle>
          </div>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette offre spéciale ? Cette action ne peut pas être annulée.
          </DialogDescription>
        </DialogHeader>
        
        <div className="border rounded-md p-4 bg-gray-50">
          <p className="font-medium">{offer.name}</p>
          <p className="text-sm text-muted-foreground">{offer.description}</p>
          {offer.discount > 0 && (
            <p className="text-sm mt-1">
              <span className="font-medium">Réduction :</span> {offer.discount}%
            </p>
          )}
          <p className="text-sm mt-1">
            <span className="font-medium">Validité :</span> Jusqu'au {new Date(offer.validUntil).toLocaleDateString('fr-FR')}
          </p>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteOfferDialog;
