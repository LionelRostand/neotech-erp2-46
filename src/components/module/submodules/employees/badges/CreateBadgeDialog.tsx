
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { BadgeData, generateBadgeNumber } from '../../../submodules/badges/BadgeTypes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CreateBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBadgeCreated: (newBadge: BadgeData) => Promise<void>;
  employees?: Employee[];
}

// Helper function to get initials
const getInitials = (firstName: string, lastName: string) => {
  return (firstName?.charAt(0) + lastName?.charAt(0)).toUpperCase();
};

const CreateBadgeDialog: React.FC<CreateBadgeDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onBadgeCreated,
  employees = []
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>(undefined);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedEmployeeObject, setSelectedEmployeeObject] = useState<Employee | null>(null);
  const [accessLevel, setAccessLevel] = useState<string | undefined>(undefined);
  const [badgeNumber, setBadgeNumber] = useState(generateBadgeNumber());

  const handleCreateBadge = () => {
    if (!selectedEmployee || !accessLevel) {
      toast.error("Veuillez sélectionner un employé et un niveau d'accès");
      return;
    }
    
    // Find the employee in the employees array
    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!employee) {
      toast.error("Employé non trouvé");
      return;
    }
    
    // Create a new badge
    const newBadge: BadgeData = {
      id: badgeNumber,
      date: new Date().toISOString().split('T')[0],
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: employee.department || '',
      accessLevel: accessLevel,
      status: "success",
      statusText: "Actif",
      company: typeof employee.company === 'string' ? employee.company : employee.company?.name || ''
    };
    
    // Callback to add the badge
    onBadgeCreated(newBadge);
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setSelectedEmployee(undefined);
    setSelectedEmployeeId('');
    setSelectedEmployeeObject(null);
    setAccessLevel(undefined);
    setBadgeNumber(generateBadgeNumber());
  };
  
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleEmployeeSelect = (value: string) => {
    setSelectedEmployee(value);
    if (value && value.includes('|')) {
      const empId = value.split('|')[1];
      setSelectedEmployeeId(empId);
      
      const selectedEmp = employees.find(emp => emp.id === empId);
      setSelectedEmployeeObject(selectedEmp || null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau badge</DialogTitle>
          <DialogDescription>
            Créez un badge d'accès pour un employé.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {selectedEmployeeObject && (
            <div className="flex items-center gap-4 p-3 border rounded-md bg-slate-50">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedEmployeeObject.photoURL} alt={selectedEmployeeObject.firstName} />
                <AvatarFallback>
                  {getInitials(selectedEmployeeObject.firstName, selectedEmployeeObject.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedEmployeeObject.firstName} {selectedEmployeeObject.lastName}</p>
                <p className="text-sm text-muted-foreground">{selectedEmployeeObject.department}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              Employé
            </Label>
            <div className="col-span-3">
              <Select 
                value={selectedEmployee} 
                onValueChange={handleEmployeeSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees && employees.length > 0 ? (
                    employees.map((employee) => (
                      <SelectItem 
                        key={employee.id} 
                        value={`${employee.firstName} ${employee.lastName}|${employee.id}`}
                      >
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-employees-available">Aucun employé disponible</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="access" className="text-right">
              Niveau d'accès
            </Label>
            <div className="col-span-3">
              <Select value={accessLevel} onValueChange={setAccessLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau d'accès" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sécurité Niveau 1">Sécurité Niveau 1</SelectItem>
                  <SelectItem value="Sécurité Niveau 2">Sécurité Niveau 2</SelectItem>
                  <SelectItem value="Sécurité Niveau 3">Sécurité Niveau 3</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="DIRECTION">DIRECTION</SelectItem>
                  <SelectItem value="PDG">PDG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="badge-number" className="text-right">
              Numéro de badge
            </Label>
            <Input id="badge-number" className="col-span-3" value={badgeNumber} disabled />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Annuler</Button>
          <Button 
            onClick={handleCreateBadge} 
            disabled={!selectedEmployee || !accessLevel}
          >
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBadgeDialog;
