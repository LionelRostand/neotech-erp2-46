
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { BadgeData, generateBadgeNumber } from './BadgeTypes';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';

interface CreateBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onBadgeCreated: (badge: BadgeData) => void;
  employees?: Employee[];
}

const CreateBadgeDialog: React.FC<CreateBadgeDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onBadgeCreated,
  employees = []
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>(undefined);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(undefined);
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);
  const [accessLevel, setAccessLevel] = useState<string | undefined>(undefined);
  const [badgeNumber, setBadgeNumber] = useState(generateBadgeNumber());
  
  const { companies } = useCompaniesData();
  const { departments } = useAvailableDepartments();

  const handleCreateBadge = () => {
    if (!selectedEmployee || !accessLevel || !selectedCompany || !selectedDepartment) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!employee) {
      toast.error("Employé non trouvé");
      return;
    }
    
    const department = departments.find(dept => dept.id === selectedDepartment);
    if (!department) {
      toast.error("Département non trouvé");
      return;
    }
    
    const newBadge: BadgeData = {
      id: badgeNumber,
      date: new Date().toISOString().split('T')[0],
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: department.name,
      accessLevel: accessLevel,
      status: "success",
      statusText: "Actif"
    };
    
    onBadgeCreated(newBadge);
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setSelectedEmployee(undefined);
    setSelectedEmployeeId('');
    setSelectedCompany(undefined);
    setSelectedDepartment(undefined);
    setAccessLevel(undefined);
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
            <Label htmlFor="company" className="text-right">
              Entreprise
            </Label>
            <div className="col-span-3">
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  {companies && companies.length > 0 ? (
                    companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-companies-available">
                      Aucune entreprise disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Département
            </Label>
            <div className="col-span-3">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {departments && departments.length > 0 ? (
                    departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-departments-available">
                      Aucun département disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

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
                  {employees && employees.length > 0 ? (
                    employees.map((employee) => (
                      <SelectItem 
                        key={employee.id} 
                        value={`${employee.firstName} ${employee.lastName}|${employee.id}`}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={employee.photoURL} alt={`${employee.firstName} ${employee.lastName}`} />
                            <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                          </Avatar>
                          {employee.firstName} {employee.lastName}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-employees-available">
                      Aucun employé disponible
                    </SelectItem>
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
                  <SelectItem value="Niveau 1">Accès Standard</SelectItem>
                  <SelectItem value="Niveau 2">Accès Avancé</SelectItem>
                  <SelectItem value="Niveau 3">Accès Administrateur</SelectItem>
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
