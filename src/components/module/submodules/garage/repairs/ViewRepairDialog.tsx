
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Repair } from '../types/garage-types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ViewRepairDialogProps {
  repair: Repair | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewRepairDialog: React.FC<ViewRepairDialogProps> = ({ 
  repair, 
  open, 
  onOpenChange 
}) => {
  if (!repair) return null;

  // Safe number conversion function
  const formatCurrency = (value?: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue && !isNaN(numValue) 
      ? numValue.toLocaleString('fr-FR', { 
          style: 'currency', 
          currency: 'EUR' 
        }) 
      : 'Non défini';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'awaiting_approval': return 'En attente d\'approbation';
      case 'approved': return 'Approuvé';
      case 'in_progress': return 'En cours';
      case 'awaiting_parts': return 'En attente de pièces';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non défini';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails de la réparation</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Client:</p>
            <p className="col-span-3">{repair.clientName}</p>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Véhicule:</p>
            <p className="col-span-3">{repair.vehicleName || repair.vehicleInfo}</p>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Description:</p>
            <p className="col-span-3">{repair.description}</p>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Mécanicien:</p>
            <p className="col-span-3">{repair.mechanicName}</p>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Statut:</p>
            <p className="col-span-3">{getStatusLabel(repair.status)}</p>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Date début:</p>
            <p className="col-span-3">{formatDate(repair.startDate || repair.date)}</p>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Date fin estimée:</p>
            <p className="col-span-3">{formatDate(repair.estimatedEndDate)}</p>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Date fin réelle:</p>
            <p className="col-span-3">{formatDate(repair.endDate)}</p>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Coût estimé:</p>
            <p className="col-span-3">{formatCurrency(repair.estimatedCost)}</p>
          </div>

          {repair.actualCost !== undefined && (
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="font-medium">Coût réel:</p>
              <p className="col-span-3">{formatCurrency(repair.actualCost)}</p>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="font-medium">Progression:</p>
            <div className="col-span-3 w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${repair.progress}%` }}>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRepairDialog;
