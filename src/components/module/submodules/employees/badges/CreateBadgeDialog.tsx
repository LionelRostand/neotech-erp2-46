
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BadgeData, generateBadgeNumber } from './BadgeTypes';
import { Employee } from '@/types/employee';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [accessLevel, setAccessLevel] = useState<string>('');
  const [badgeNumber, setBadgeNumber] = useState(generateBadgeNumber());
  const [companyValue, setCompanyValue] = useState<string>('');
  
  // Get unique companies from employees
  const companies = React.useMemo(() => {
    const uniqueCompanies = new Map();
    employees.forEach(emp => {
      if (emp.company && typeof emp.company === 'string' && !uniqueCompanies.has(emp.company)) {
        uniqueCompanies.set(emp.company, 'Entreprise');
      } else if (emp.company && typeof emp.company === 'object' && emp.company.id && !uniqueCompanies.has(emp.company.id)) {
        uniqueCompanies.set(emp.company.id, emp.company.name || 'Entreprise');
      }
    });
    return Array.from(uniqueCompanies).map(([id, name]) => ({ id, name }));
  }, [employees]);

  // Get unique departments
  const departments = React.useMemo(() => {
    const uniqueDepartments = new Set();
    employees.forEach(emp => {
      if (emp.department) {
        uniqueDepartments.add(emp.department);
      }
    });
    return Array.from(uniqueDepartments) as string[];
  }, [employees]);

  // Get selected employee data
  const selectedEmployeeData = React.useMemo(() => {
    return employees.find(emp => emp.id === selectedEmployeeId);
  }, [selectedEmployeeId, employees]);

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
      department: selectedDepartment || employee.department || '',
      accessLevel: accessLevel,
      status: "success",
      statusText: "Actif",
      company: companyValue || (typeof employee.company === 'string' ? employee.company : 
                           typeof employee.company === 'object' && employee.company ? employee.company.id : ''),
      photoURL: employee.photoURL || employee.photo || ''
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
    setSelectedDepartment('');
    setAccessLevel('');
    setCompanyValue('');
    setBadgeNumber(generateBadgeNumber());
  };
  
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  // Update company and department when employee is selected
  useEffect(() => {
    if (selectedEmployeeId) {
      const employee = employees.find(emp => emp.id === selectedEmployeeId);
      if (employee) {
        if (employee.company) {
          if (typeof employee.company === 'string') {
            setCompanyValue(employee.company);
          } else if (typeof employee.company === 'object' && employee.company.id) {
            setCompanyValue(employee.company.id);
          }
        }
        if (employee.department) {
          setSelectedDepartment(employee.department);
        }
      }
    }
  }, [selectedEmployeeId, employees]);

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

          {selectedEmployeeData && (
            <div className="flex justify-center py-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src={selectedEmployeeData.photoURL || selectedEmployeeData.photo} />
                <AvatarFallback>
                  {`${selectedEmployeeData.firstName[0]}${selectedEmployeeData.lastName[0]}`}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          {companies.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Entreprise
              </Label>
              <div className="col-span-3">
                <Select value={companyValue} onValueChange={setCompanyValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem 
                        key={company.id} 
                        value={company.id}
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

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
                  {departments.map((department) => (
                    <SelectItem 
                      key={department} 
                      value={department}
                    >
                      {department}
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
          <Button onClick={handleCreateBadge}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBadgeDialog;
