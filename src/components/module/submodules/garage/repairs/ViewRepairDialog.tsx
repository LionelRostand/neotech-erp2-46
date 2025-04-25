
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Repair } from '../types/garage-types';
import { Progress } from "@/components/ui/progress";

interface ViewRepairDialogProps {
  repair: Repair | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewRepairDialog = ({ repair, open, onOpenChange }: ViewRepairDialogProps) => {
  if (!repair) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'awaiting_parts':
        return <Badge className="bg-amber-100 text-amber-800">En attente de pièces</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Détails de la réparation</span>
            {getStatusBadge(repair.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Client</h3>
            <p>{repair.clientName}</p>
          </div>

          <div>
            <h3 className="font-medium mb-1">Véhicule</h3>
            <p>{repair.vehicleName}</p>
            <p className="text-sm text-gray-500">Immatriculation: {repair.licensePlate}</p>
          </div>

          <div>
            <h3 className="font-medium mb-1">Service</h3>
            <p>{repair.service}</p>
          </div>

          <div>
            <h3 className="font-medium mb-1">Dates</h3>
            <p className="text-sm">Début: {format(new Date(repair.startDate), 'dd MMMM yyyy', { locale: fr })}</p>
            <p className="text-sm">Fin estimée: {format(new Date(repair.estimatedEndDate), 'dd MMMM yyyy', { locale: fr })}</p>
          </div>

          <div>
            <h3 className="font-medium mb-1">Description</h3>
            <p className="text-sm">{repair.description}</p>
          </div>

          <div>
            <h3 className="font-medium mb-1">Progression ({repair.progress}%)</h3>
            <Progress value={repair.progress} className="h-2" />
          </div>

          <div>
            <h3 className="font-medium mb-1">Coût estimé</h3>
            <p>{repair.estimatedCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRepairDialog;
