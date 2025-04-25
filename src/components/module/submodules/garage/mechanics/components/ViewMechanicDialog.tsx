
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mechanic } from '../../types/garage-types';

interface ViewMechanicDialogProps {
  mechanic: Mechanic | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewMechanicDialog = ({ mechanic, isOpen, onClose }: ViewMechanicDialogProps) => {
  if (!mechanic) return null;

  // Ensure specialization is properly formatted for display
  const formatSpecialization = (specialization: any): string => {
    if (!specialization) return 'Aucune spécialisation';
    
    if (Array.isArray(specialization)) {
      return specialization.length > 0 ? specialization.join(', ') : 'Aucune spécialisation';
    }
    
    if (typeof specialization === 'string') {
      return specialization || 'Aucune spécialisation';
    }
    
    return 'Aucune spécialisation';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du mécanicien</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Nom complet:</span>
            <span className="col-span-2">{mechanic.firstName} {mechanic.lastName}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Email:</span>
            <span className="col-span-2">{mechanic.email}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Téléphone:</span>
            <span className="col-span-2">{mechanic.phone}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Spécialisation:</span>
            <span className="col-span-2">{formatSpecialization(mechanic.specialization)}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Statut:</span>
            <span className="col-span-2">
              {mechanic.status === 'available' ? 'Disponible' :
               mechanic.status === 'in_service' ? 'En service' :
               mechanic.status === 'on_break' ? 'En pause' : mechanic.status}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMechanicDialog;
