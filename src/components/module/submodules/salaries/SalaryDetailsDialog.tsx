
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface SalaryDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: any;
}

export const SalaryDetailsDialog: React.FC<SalaryDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  employee
}) => {
  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails du salaire</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Employé</Label>
              <p className="font-medium">{employee.name}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">ID</Label>
              <p className="font-medium">#{employee.id}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Poste</Label>
              <p className="font-medium">{employee.position}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Département</Label>
              <p className="font-medium">{employee.department}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Salaire Annuel</Label>
              <p className="font-medium">{employee.salary.toLocaleString('fr-FR')} €</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Salaire Mensuel</Label>
              <p className="font-medium">{(employee.salary / 12).toLocaleString('fr-FR')} €</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Dernière paie</Label>
              <p className="font-medium">{employee.paymentDate}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Statut</Label>
              <Badge 
                variant={employee.status === 'paid' ? 'default' : 'outline'}
                className={employee.status === 'paid' ? 'bg-green-500' : ''}
              >
                {employee.status === 'paid' ? 'Payé' : 'En attente'}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
