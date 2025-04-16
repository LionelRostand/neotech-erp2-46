
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { BadgeData, generateBadgeNumber } from './BadgeTypes';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';
import { useCompaniesData } from '@/hooks/useCompaniesData';

interface CreateBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
  const [department, setDepartment] = useState<string>('no_department');
  const [company, setCompany] = useState<string>('');
  const [badgeNumber, setBadgeNumber] = useState(generateBadgeNumber());
  const { departments } = useAvailableDepartments();
  const { companies } = useCompaniesData();

  const handleCreateBadge = () => {
    if (!selectedEmployee || !accessLevel) {
      toast.error("Veuillez sélectionner un employé et un niveau d'accès");
      return;
    }
    
    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!employee) {
      toast.error("Employé non trouvé");
      return;
    }
    
    const departmentName = departments.find(dept => dept.id === (department === 'no_department' ? employee.department : department))?.name 
      || (department === 'no_department' ? 'Non assigné' : department);
    
    // Get company name from the employee's company property
    let companyName = company;
    if (!companyName) {
      if (typeof employee.company === 'object' && employee.company !== null) {
        companyName = employee.company.name || 'Entreprise';
      } else if (typeof employee.company === 'string') {
        // Try to find company name in companies list
        const foundCompany = companies.find(c => c.id === employee.company);
        companyName = foundCompany ? foundCompany.name : 'Entreprise';
      } else {
        companyName = 'Entreprise';
      }
    }
    
    const newBadge: BadgeData = {
      id: badgeNumber,
      date: new Date().toISOString().split('T')[0],
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: departmentName,
      company: companyName,
      accessLevel: accessLevel,
      status: "success",
      statusText: "Actif"
    };
    
    onBadgeCreated(newBadge);
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setSelectedEmployee('');
    setSelectedEmployeeId('');
    setAccessLevel('');
    setDepartment('no_department');
    setCompany('');
    setBadgeNumber(generateBadgeNumber());
  };
  
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  // Update employee data when an employee is selected
  useEffect(() => {
    if (selectedEmployeeId) {
      const employee = employees.find(emp => emp.id === selectedEmployeeId);
      if (employee) {
        if (employee.department) {
          setDepartment(employee.department);
        }
        
        // Set company if available
        if (typeof employee.company === 'object' && employee.company !== null) {
          setCompany(employee.company.name || '');
        } else if (typeof employee.company === 'string') {
          const foundCompany = companies.find(c => c.id === employee.company);
          setCompany(foundCompany ? foundCompany.name : '');
        }
      }
    }
  }, [selectedEmployeeId, employees, companies]);

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
                value={selectedEmployee || "none"} 
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
                  <SelectItem value="none" disabled>Sélectionner un employé</SelectItem>
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
            <Label htmlFor="department" className="text-right">
              Département
            </Label>
            <div className="col-span-3">
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_department">Département de l'employé</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Entreprise
            </Label>
            <div className="col-span-3">
              <Input 
                id="company" 
                value={company} 
                onChange={(e) => setCompany(e.target.value)} 
                placeholder="Entreprise de l'employé" 
                readOnly 
                className="bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="access" className="text-right">
              Niveau d'accès
            </Label>
            <div className="col-span-3">
              <Select value={accessLevel || "none"} onValueChange={setAccessLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau d'accès" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" disabled>Sélectionner un niveau d'accès</SelectItem>
                  <SelectItem value="Niveau 1">Niveau 1 - Standard</SelectItem>
                  <SelectItem value="Niveau 2">Niveau 2 - Restreint</SelectItem>
                  <SelectItem value="Niveau 3">Niveau 3 - Sécurisé</SelectItem>
                  <SelectItem value="Admin">Admin - Accès total</SelectItem>
                  <SelectItem value="Direction">Direction</SelectItem>
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
