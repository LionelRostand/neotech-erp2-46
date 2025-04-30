
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Contract } from '@/hooks/useContractsData';

interface ViewContractDialogProps {
  contract: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewContractDialog: React.FC<ViewContractDialogProps> = ({ contract, open, onOpenChange }) => {
  if (!contract) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-4">Détails du contrat</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={contract.employeePhoto} alt={contract.employeeName} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <User size={24} />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{contract.employeeName}</h3>
              <p className="text-muted-foreground">{contract.position}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Type de contrat</p>
              <p className="text-base">{contract.type}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Statut</p>
              <p className="text-base">
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                  ${contract.status === 'Actif' ? 'bg-green-100 text-green-800' : 
                  contract.status === 'À venir' ? 'bg-blue-100 text-blue-800' : 
                  'bg-red-100 text-red-800'}`}>
                  {contract.status}
                </span>
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date de début</p>
              <p className="text-base">{contract.startDate}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date de fin</p>
              <p className="text-base">{contract.endDate || 'Non définie'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Département</p>
              <p className="text-base">{contract.department}</p>
            </div>
            
            {contract.salary && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Salaire</p>
                <p className="text-base">{contract.salary.toLocaleString('fr-FR')} €</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Fermer</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewContractDialog;
