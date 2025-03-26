
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { employees } from '@/data/employees';

interface NewSalaryFormData {
  name: string;
  position: string;
  department: string;
  salary: string;
  paymentDate: string;
  status: string;
  employeeId: string;
}

interface NewSalaryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: NewSalaryFormData;
  setFormData: React.Dispatch<React.SetStateAction<NewSalaryFormData>>;
  onEmployeeSelection: (employeeId: string) => void;
  onCreate: () => void;
}

export const NewSalaryDialog: React.FC<NewSalaryDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onEmployeeSelection,
  onCreate
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouvelle fiche de paie</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="employee-select">Sélectionnez un employé</Label>
            <Select
              value={formData.employeeId || ""}
              onValueChange={onEmployeeSelection}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un employé" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {!formData.employeeId && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'employé</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nom complet"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Poste</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Poste occupé"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Département"
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="salary">Salaire annuel (€)</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="Ex: 45000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentDate">Date de paiement</Label>
            <Input
              id="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onCreate}>
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
