
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

interface EditSalaryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: any;
  formData: {
    salary: string;
    position: string;
    department: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    salary: string;
    position: string;
    department: string;
  }>>;
  onSave: () => void;
}

export const EditSalaryDialog: React.FC<EditSalaryDialogProps> = ({
  isOpen,
  onOpenChange,
  employee,
  formData,
  setFormData,
  onSave
}) => {
  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier les informations salariales</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employé</Label>
            <div className="font-medium">{employee.name}</div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Poste</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Département</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salary">Salaire annuel (€)</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onSave}>
            Enregistrer les modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
