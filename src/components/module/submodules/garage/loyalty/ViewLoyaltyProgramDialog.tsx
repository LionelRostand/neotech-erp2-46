
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoyaltyProgram } from '../types/loyalty-types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ViewLoyaltyProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: LoyaltyProgram | null;
}

const ViewLoyaltyProgramDialog: React.FC<ViewLoyaltyProgramDialogProps> = ({
  open,
  onOpenChange,
  program
}) => {
  // If no program is selected, don't render anything
  if (!program) return null;
  
  // Format dates if they exist
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">À venir</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Détails du programme de fidélité</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-xl font-semibold">{program.name}</h3>
            <div className="mt-1">{getStatusBadge(program.status)}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Multiplicateur de points</p>
              <p className="text-lg font-medium">x{program.pointsMultiplier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dépense minimum</p>
              <p className="text-lg font-medium">{program.minimumSpend}€</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="mt-1">{program.description}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Avantages</p>
            <p className="mt-1">{program.benefitsDescription}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Date de début</p>
              <p>{formatDate(program.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de fin</p>
              <p>{formatDate(program.endDate)}</p>
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

export default ViewLoyaltyProgramDialog;
