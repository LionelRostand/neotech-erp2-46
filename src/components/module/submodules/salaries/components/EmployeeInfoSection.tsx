
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Employee } from '@/types/employee';

interface EmployeeInfoSectionProps {
  employeeName: string;
  setEmployeeName: (name: string) => void;
  period: string;
  setPeriod: (period: string) => void;
  grossSalary: string;
  setGrossSalary: (salary: string) => void;
  employees: Employee[];
  handleEmployeeSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const EmployeeInfoSection: React.FC<EmployeeInfoSectionProps> = ({
  employeeName,
  setEmployeeName,
  period,
  setPeriod,
  grossSalary,
  setGrossSalary,
  employees,
  handleEmployeeSelect
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="employeeSection">Informations de l'employé</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="employeeSelect">Sélectionner un employé</Label>
          <select 
            id="employeeSelect" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
            onChange={handleEmployeeSelect}
            defaultValue=""
          >
            <option value="">Sélectionner un employé</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName} - {employee.position}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="employeeName">Nom et prénom</Label>
          <Input 
            id="employeeName" 
            placeholder="Jean Dupont"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="period">Période</Label>
          <Input 
            id="period" 
            placeholder="Juin 2023"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="grossSalary">Salaire brut (€)</Label>
          <Input 
            id="grossSalary" 
            placeholder="3000" 
            type="number"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfoSection;
