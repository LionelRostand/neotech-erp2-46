
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { BadgeData, generateBadgeNumber } from './BadgeTypes';

interface CreateBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBadgeCreated: (newBadge: BadgeData) => Promise<void>;
  employees?: Employee[];
}

const CreateBadgeDialog: React.FC<CreateBadgeDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onBadgeCreated,
  employees = []
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [accessLevel, setAccessLevel] = useState<string>('');
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
      department: employee.department,
      accessLevel: accessLevel,
      status: "success",
      statusText: "Actif"
    };
    
    // Callback to add the badge
    onBadgeCreated(newBadge);
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setSelectedEmployee('');
    setSelectedEmployeeId('');
    setAccessLevel('');
    setBadgeNumber(generateBadgeNumber());
  };
  
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau badge</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              Employé
            </Label>
            <div className="col-span-3">
              <Select 
                value={selectedEmployee || undefined} 
                onValueChange={(value) => {
                  setSelectedEmployee(value);
                  const empId = value.split('|')[1];
                  setSelectedEmployeeId(empId);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {/* Replace the empty value with a non-empty placeholder value */}
                  <SelectItem value="placeholder" disabled>Sélectionner un employé</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem 
                      key={employee.id} 
                      value={`${employee.firstName} ${employee.lastName}|${employee.id}`}
                    >
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="access" className="text-right">
              Niveau d'accès
            </Label>
            <div className="col-span-3">
              <Select value={accessLevel || undefined} onValueChange={setAccessLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau d'accès" />
                </SelectTrigger>
                <SelectContent>
                  {/* Replace the empty value with a non-empty placeholder value */}
                  <SelectItem value="placeholder" disabled>Sélectionner un niveau d'accès</SelectItem>
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
          <Button onClick={handleCreateBadge}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBadgeDialog;
