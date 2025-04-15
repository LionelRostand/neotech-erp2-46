
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { BadgeData, generateBadgeNumber } from './BadgeTypes';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>(undefined);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [accessLevel, setAccessLevel] = useState<string | undefined>(undefined);
  const [badgeNumber, setBadgeNumber] = useState(generateBadgeNumber());
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(undefined);
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);
  const { companies } = useCompaniesData();
  const { departments } = useEmployeeData();
  const [selectedEmployeePhoto, setSelectedEmployeePhoto] = useState<string>('');

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setBadgeNumber(generateBadgeNumber());
    }
  }, [isOpen]);

  const handleEmployeeSelect = (value: string) => {
    setSelectedEmployee(value);
    const [empName, empId] = value.split('|');
    setSelectedEmployeeId(empId);
    
    // Find the employee to get their photo and set department/company
    const employee = employees.find(emp => emp.id === empId);
    if (employee) {
      setSelectedEmployeePhoto(employee.photoURL || '');
      
      // Pre-select their department if available
      if (employee.department) {
        setSelectedDepartment(employee.department);
      }
      
      // Pre-select their company if available
      if (employee.company) {
        const companyId = typeof employee.company === 'string' ? 
          employee.company : employee.company.id;
        setSelectedCompany(companyId);
      }
    }
  };

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
    
    // Get company name if selected
    let companyName = '';
    if (selectedCompany) {
      const company = companies.find(c => c.id === selectedCompany);
      companyName = company ? company.name : '';
    }
    
    // Create a new badge
    const newBadge: BadgeData = {
      id: badgeNumber,
      date: new Date().toISOString().split('T')[0],
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: selectedDepartment || employee.department || '',
      accessLevel: accessLevel,
      status: "success",
      statusText: "Actif",
      company: companyName || '',
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
    setAccessLevel(undefined);
    setSelectedCompany(undefined);
    setSelectedDepartment(undefined);
    setSelectedEmployeePhoto('');
    setBadgeNumber(generateBadgeNumber());
  };
  
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  // Simplified access levels
  const accessLevels = [
    { id: "niveau1", label: "Niveau 1 - Accès basique" },
    { id: "niveau2", label: "Niveau 2 - Accès intermédiaire" },
    { id: "niveau3", label: "Niveau 3 - Accès avancé" },
    { id: "admin", label: "Administration - Accès complet" },
    { id: "direction", label: "Direction - Accès tous secteurs" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau badge</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Photo preview */}
          {selectedEmployeePhoto && (
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24 border-2 border-primary">
                <AvatarImage src={selectedEmployeePhoto} alt="Photo employé" />
                <AvatarFallback>
                  {selectedEmployee?.split('|')[0].substr(0, 2).toUpperCase() || 'EM'}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          
          {/* Employee selection */}
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
                    <SelectItem value="no-employees">Aucun employé disponible</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Company selection */}
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
                    <SelectItem value="no-company">Aucune entreprise disponible</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Department selection */}
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
                    departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-department">Aucun département disponible</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Access level */}
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
                  {accessLevels.map(level => (
                    <SelectItem key={level.id} value={level.label}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Badge number */}
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
