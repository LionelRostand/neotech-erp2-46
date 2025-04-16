
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { BadgeData, generateBadgeNumber, accessLevels } from './BadgeTypes';
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface CreateBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onBadgeCreated: (badge: BadgeData) => void;
  employees: Employee[];
}

const CreateBadgeDialog: React.FC<CreateBadgeDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onBadgeCreated,
  employees 
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [accessLevel, setAccessLevel] = useState<string>('');
  const [badgeNumber, setBadgeNumber] = useState(generateBadgeNumber());
  const [employeeCompany, setEmployeeCompany] = useState<string>('');
  const { companies } = useHrModuleData();

  // Réinitialiser le formulaire quand le dialogue s'ouvre
  useEffect(() => {
    if (isOpen) {
      setBadgeNumber(generateBadgeNumber());
    }
  }, [isOpen]);

  // Mettre à jour l'entreprise quand l'employé est sélectionné
  useEffect(() => {
    if (selectedEmployeeId) {
      const employee = employees.find(emp => emp.id === selectedEmployeeId);
      if (employee) {
        // Récupérer le nom de l'entreprise
        let companyName = "Non spécifiée";
        
        if (employee.company) {
          if (typeof employee.company === 'string') {
            // Si company est un ID, rechercher dans la liste des entreprises
            const company = companies.find(c => c.id === employee.company);
            if (company) {
              companyName = company.name;
            }
          } else if (typeof employee.company === 'object' && employee.company !== null) {
            // Si company est un objet
            companyName = employee.company.name || "Non spécifiée";
          }
        }
        
        setEmployeeCompany(companyName);
      }
    }
  }, [selectedEmployeeId, employees, companies]);

  const handleCreateBadge = () => {
    if (!selectedEmployee || !accessLevel) {
      toast.error("Veuillez sélectionner un employé et un niveau d'accès");
      return;
    }
    
    // Trouver l'employé
    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!employee) {
      toast.error("Employé non trouvé");
      return;
    }
    
    // Créer un nouveau badge
    const newBadge: BadgeData = {
      id: `badge_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: employee.department || "Non spécifié",
      accessLevel: accessLevel,
      status: "success",
      statusText: "Actif",
      company: employeeCompany,
      badgeNumber: badgeNumber
    };
    
    // Callback pour ajouter le badge
    onBadgeCreated(newBadge);
    
    // Réinitialiser le formulaire et fermer le dialogue
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setSelectedEmployee('');
    setSelectedEmployeeId('');
    setAccessLevel('');
    setEmployeeCompany('');
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
                value={selectedEmployee} 
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
          
          {employeeCompany && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Entreprise</Label>
              <div className="col-span-3">
                <Input value={employeeCompany} disabled className="bg-gray-50" />
              </div>
            </div>
          )}
          
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
                  {accessLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="badge-number" className="text-right">
              ID Badge
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
