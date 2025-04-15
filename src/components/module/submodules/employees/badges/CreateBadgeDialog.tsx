
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { BadgeData, generateBadgeNumber } from '@/components/module/submodules/badges/BadgeTypes';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface CreateBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBadgeCreated: (newBadge: BadgeData) => Promise<void>;
  employees?: Employee[];
}

const accessLevels = [
  { id: "level1", name: "Sécurité Niveau 1" },
  { id: "level2", name: "Sécurité Niveau 2" },
  { id: "level3", name: "Sécurité Niveau 3" },
  { id: "admin", name: "Administration" },
  { id: "it", name: "IT" },
  { id: "hr", name: "RH" },
  { id: "marketing", name: "Marketing" },
  { id: "direction", name: "DIRECTION" },
  { id: "ceo", name: "PDG" }
];

const CreateBadgeDialog: React.FC<CreateBadgeDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onBadgeCreated,
  employees = []
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>(undefined);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedEmployee_Object, setSelectedEmployee_Object] = useState<Employee | null>(null);
  const [accessLevel, setAccessLevel] = useState<string | undefined>(undefined);
  const [badgeNumber, setBadgeNumber] = useState(generateBadgeNumber());
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const [departmentId, setDepartmentId] = useState<string | undefined>(undefined);
  
  const { companies } = useCompaniesData();
  const { departments } = useAvailableDepartments();

  const handleCreateBadge = () => {
    if (!selectedEmployee || !accessLevel || !departmentId || !companyId) {
      toast.error("Veuillez compléter tous les champs obligatoires");
      return;
    }
    
    // Find the employee in the employees array
    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!employee) {
      toast.error("Employé non trouvé");
      return;
    }
    
    // Find department and company names
    const department = departments.find(dept => dept.id === departmentId);
    const company = companies.find(comp => comp.id === companyId);
    
    // Create a new badge
    const newBadge: BadgeData = {
      id: badgeNumber,
      date: new Date().toISOString().split('T')[0],
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: department?.name || departmentId,
      accessLevel: accessLevels.find(al => al.id === accessLevel)?.name || accessLevel,
      status: "success",
      statusText: "Actif",
      company: company?.name || companyId
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
    setSelectedEmployee_Object(null);
    setAccessLevel(undefined);
    setCompanyId(undefined);
    setDepartmentId(undefined);
    setBadgeNumber(generateBadgeNumber());
  };
  
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };
  
  const handleEmployeeSelect = (value: string) => {
    if (!value || value === "no-employees" || !value.includes('|')) {
      setSelectedEmployee(undefined);
      setSelectedEmployeeId('');
      setSelectedEmployee_Object(null);
      return;
    }
    
    const [empName, empId] = value.split('|');
    setSelectedEmployee(value);
    setSelectedEmployeeId(empId);
    
    // Find and set the employee object
    const employeeObj = employees.find(emp => emp.id === empId);
    setSelectedEmployee_Object(employeeObj || null);
    
    // If employee has a company or department, set those values
    if (employeeObj) {
      if (employeeObj.company && typeof employeeObj.company === 'string') {
        setCompanyId(employeeObj.company);
      }
      
      if (employeeObj.departmentId) {
        setDepartmentId(employeeObj.departmentId);
      } else if (employeeObj.department && typeof employeeObj.department === 'string') {
        // Try to find department by name
        const dept = departments.find(d => d.name === employeeObj.department);
        if (dept) {
          setDepartmentId(dept.id);
        }
      }
    }
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
          
          {selectedEmployee_Object && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Photo</Label>
              <div className="col-span-3 flex items-center">
                <Avatar className="h-12 w-12 mr-2">
                  {selectedEmployee_Object.photoURL ? (
                    <AvatarImage src={selectedEmployee_Object.photoURL} alt={selectedEmployee_Object.firstName} />
                  ) : null}
                  <AvatarFallback>
                    {getInitials(selectedEmployee_Object.firstName, selectedEmployee_Object.lastName)}
                  </AvatarFallback>
                </Avatar>
                <span>{selectedEmployee_Object.firstName} {selectedEmployee_Object.lastName}</span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Entreprise
            </Label>
            <div className="col-span-3">
              <Select value={companyId} onValueChange={setCompanyId}>
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
                    <SelectItem value="no-companies">Aucune entreprise disponible</SelectItem>
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
              <Select value={departmentId} onValueChange={setDepartmentId}>
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
                    <SelectItem value="no-departments">Aucun département disponible</SelectItem>
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
                  {accessLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
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
