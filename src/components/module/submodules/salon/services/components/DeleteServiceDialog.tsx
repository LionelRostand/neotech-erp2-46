
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { SalonService } from '../../types/salon-types';

interface DeleteServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: SalonService;
  onDelete: () => void;
}

const DeleteServiceDialog: React.FC<DeleteServiceDialogProps> = ({
  open,
  onOpenChange,
  service,
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
            <DialogTitle>Supprimer le service</DialogTitle>
          </div>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce service ? Cette action ne peut pas être annulée.
          </DialogDescription>
        </DialogHeader>
        
        <div className="border rounded-md p-4 bg-gray-50">
          <p className="font-medium">{service.name}</p>
          <p className="text-sm text-muted-foreground">{service.description}</p>
          <p className="text-sm mt-1">
            <span className="font-medium">Prix :</span> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(service.price)}
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

export default DeleteServiceDialog;
