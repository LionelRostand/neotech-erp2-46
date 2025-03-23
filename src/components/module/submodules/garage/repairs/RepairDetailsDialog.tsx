
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Car, User, Calendar, Wrench, ClipboardList, Receipt } from 'lucide-react';
import { Repair } from './repairsData';

interface RepairDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repair: Repair;
  mechanicsMap: Record<string, string>;
}

const RepairDetailsDialog: React.FC<RepairDetailsDialogProps> = ({ 
  open, 
  onOpenChange, 
  repair,
  mechanicsMap
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">En cours</Badge>;
      case 'awaiting_parts':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">En attente de pièces</Badge>;
      case 'awaiting_approval':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">En attente d'approbation</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Terminé</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Annulé</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Détails de la réparation {repair.id}</span>
            {getStatusBadge(repair.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium">Véhicule</h3>
              </div>
              <div className="pl-6">
                <p>{repair.vehicleName}</p>
                <p className="text-sm text-gray-500">Immatriculation: {repair.licensePlate}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium">Client</h3>
              </div>
              <div className="pl-6">
                <p>{repair.clientName}</p>
              </div>
            </div>
          </div>

          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium">Dates</h3>
              </div>
              <div className="pl-6">
                <p className="text-sm">Début: {new Date(repair.startDate).toLocaleDateString('fr-FR')}</p>
                <p className="text-sm">Fin prévue: {new Date(repair.estimatedEndDate).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium">Mécanicien</h3>
              </div>
              <div className="pl-6">
                <p>{mechanicsMap[repair.mechanicId] || repair.mechanicId}</p>
              </div>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-gray-500" />
              <h3 className="font-medium">Description</h3>
            </div>
            <div className="pl-6">
              <p className="text-sm">{repair.description}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Progression</h3>
              <span>{repair.progress}%</span>
            </div>
            <Progress value={repair.progress} className="h-2" />
          </div>

          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-gray-500" />
              <h3 className="font-medium">Informations financières</h3>
            </div>
            <div className="pl-6">
              <div className="flex justify-between">
                <span>Coût estimé:</span>
                <span className="font-medium">{repair.estimatedCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              {repair.actualCost && (
                <div className="flex justify-between">
                  <span>Coût réel:</span>
                  <span className="font-medium">{repair.actualCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                </div>
              )}
            </div>
          </div>

          {repair.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium">Notes</h3>
                <p className="text-sm">{repair.notes}</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RepairDetailsDialog;
