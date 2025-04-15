
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BadgeData, generateBadgeNumber } from './BadgeTypes';
import { Building, User } from 'lucide-react';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface CreateBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onBadgeCreated: (badge: BadgeData) => void;
}

const CreateBadgeDialog: React.FC<CreateBadgeDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onBadgeCreated 
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [accessLevel, setAccessLevel] = useState<string>('');
  const [badgeNumber, setBadgeNumber] = useState(generateBadgeNumber());
  const [employeePhoto, setEmployeePhoto] = useState<string>('');

  const { companies, isLoading: isLoadingCompanies } = useCompaniesData();
  const { employees, departments } = useEmployeeData();

  const handleEmployeeChange = (value: string) => {
    const [employeeName, empId] = value.split('|');
    setSelectedEmployee(employeeName);
    setSelectedEmployeeId(empId);
    
    // Find employee and set their photo
    const employee = employees.find(emp => emp.id === empId);
    if (employee) {
      setEmployeePhoto(employee.photoURL || employee.photo || '');
      // If employee has a department, set it
      if (employee.department) {
        setSelectedDepartment(employee.department);
      }
    }
  };

  const handleCreateBadge = () => {
    if (!selectedEmployee || !accessLevel || !selectedCompany) {
      toast.error("Veuillez sélectionner un employé, une entreprise et un niveau d'accès");
      return;
    }
    
    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!employee) {
      toast.error("Employé non trouvé");
      return;
    }
    
    const newBadge: BadgeData = {
      id: badgeNumber,
      date: new Date().toISOString().split('T')[0],
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: selectedDepartment || '',
      company: selectedCompany,
      accessLevel: accessLevel,
      status: "success",
      statusText: "Actif",
      photoURL: employeePhoto
    };
    
    onBadgeCreated(newBadge);
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setSelectedEmployee('');
    setSelectedEmployeeId('');
    setSelectedCompany('');
    setSelectedDepartment('');
    setAccessLevel('');
    setBadgeNumber(generateBadgeNumber());
    setEmployeePhoto('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau badge</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right flex items-center gap-2">
              <Building className="h-4 w-4" />
              Entreprise
            </Label>
            <div className="col-span-3">
              <Select 
                value={selectedCompany} 
                onValueChange={setSelectedCompany}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem 
                      key={company.id} 
                      value={company.name}
                    >
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right flex items-center gap-2">
              <User className="h-4 w-4" />
              Employé
            </Label>
            <div className="col-span-3">
              <Select 
                value={`${selectedEmployee}|${selectedEmployeeId}`} 
                onValueChange={handleEmployeeChange}
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
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={employee.photoURL || employee.photo} />
                          <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                        </Avatar>
                        {employee.firstName} {employee.lastName}
                      </div>
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
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem 
                      key={department.id} 
                      value={department.id}
                    >
                      {department.name}
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

          {employeePhoto && (
            <div className="flex justify-center py-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src={employeePhoto} alt="Photo de l'employé" />
                <AvatarFallback>{selectedEmployee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleCreateBadge}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBadgeDialog;
