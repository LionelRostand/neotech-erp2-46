
import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateBadgeDialogProps, BadgeData } from './BadgeTypes';
import { Employee } from '@/types/employee';
import { Badge } from 'lucide-react';

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
  'Sécurité niveau 1',
  'Sécurité niveau 2',
  'Sécurité niveau 3'
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
  const [badgeNumber, setBadgeNumber] = useState<string>('');
  const [uniqueEmployees, setUniqueEmployees] = useState<Employee[]>([]);
  
  // Generate a badge number on dialog open
  useEffect(() => {
    if (isOpen) {
      setBadgeNumber(`B-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [isOpen]);
  
  // Filter out duplicate employees by email and name
  useEffect(() => {
    if (employees && employees.length > 0) {
      const filteredEmployees = employees.reduce((acc: Employee[], current) => {
        const isDuplicate = acc.find(
          (item) => 
            item.email === current.email || 
            (item.firstName === current.firstName && item.lastName === current.lastName)
        );
        
        if (!isDuplicate) {
          acc.push(current);
        }
        
        return acc;
      }, []);
      
      setUniqueEmployees(filteredEmployees);
    }
  }, [employees]);
  
  const handleCreate = async () => {
    if (!selectedEmployeeId || !selectedAccessLevel) {
      return;
    }
    
    // Trouver les informations de l'employé sélectionné
    const employee = uniqueEmployees.find(emp => emp.id === selectedEmployeeId);
    if (!employee) return;
    
    const newBadge: BadgeData = {
      id: badgeNumber,
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
          <DialogTitle className="flex items-center gap-2">
            <Badge className="h-5 w-5" />
            Créer un nouveau badge
          </DialogTitle>
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
                {uniqueEmployees.map((employee) => (
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="badgeNumber" className="text-right">
              Numéro de badge
            </Label>
            <Input 
              id="badgeNumber" 
              value={badgeNumber}
              disabled
              className="col-span-3 bg-gray-100"
            />
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
