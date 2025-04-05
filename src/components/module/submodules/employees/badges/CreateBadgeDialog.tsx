
import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { v4 as uuidv4 } from 'uuid';
import { CreateBadgeDialogProps, BadgeData } from './BadgeTypes';
import { Employee } from '@/types/employee';

const accessLevels = [
  'Direction',
  'Administration',
  'RH',
  'Informatique',
  'Finance',
  'Marketing',
  'Commercial',
  'Production',
  'Logistique',
  'Sécurité'
];

const dateToString = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const CreateBadgeDialog: React.FC<CreateBadgeDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onBadgeCreated,
  employees = [] 
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<string>('');
  
  const handleCreate = async () => {
    if (!selectedEmployeeId || !selectedAccessLevel) {
      return;
    }
    
    // Trouver les informations de l'employé sélectionné
    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!employee) return;
    
    const newBadge: BadgeData = {
      id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
      date: dateToString(new Date()),
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: employee.department,
      accessLevel: selectedAccessLevel,
      status: 'success',
      statusText: 'Actif'
    };
    
    await onBadgeCreated(newBadge);
    // Réinitialiser les valeurs
    setSelectedEmployeeId('');
    setSelectedAccessLevel('');
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau badge</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              Employé
            </Label>
            <Select 
              value={selectedEmployeeId || undefined}
              onValueChange={setSelectedEmployeeId}
            >
              <SelectTrigger id="employee" className="col-span-3">
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {`${employee.firstName} ${employee.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="accessLevel" className="text-right">
              Niveau d'accès
            </Label>
            <Select 
              value={selectedAccessLevel || undefined}
              onValueChange={setSelectedAccessLevel}
            >
              <SelectTrigger id="accessLevel" className="col-span-3">
                <SelectValue placeholder="Sélectionner un niveau d'accès" />
              </SelectTrigger>
              <SelectContent>
                {accessLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!selectedEmployeeId || !selectedAccessLevel}
          >
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBadgeDialog;
