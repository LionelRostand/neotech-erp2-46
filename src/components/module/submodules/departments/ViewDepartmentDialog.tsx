
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Department } from './types';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { useEmployeeData } from '@/hooks/useEmployeeData';

interface ViewDepartmentDialogProps {
  department: Department;
  onClose: () => void;
}

const ViewDepartmentDialog: React.FC<ViewDepartmentDialogProps> = ({ department, onClose }) => {
  const { companies } = useCompaniesData();
  const { employees } = useEmployeeData();
  
  // Get company name
  const getCompanyName = () => {
    if (!department.companyId) return 'Aucune entreprise';
    const company = companies.find(c => c.id === department.companyId);
    return company ? company.name : 'Aucune entreprise';
  };
  
  // Get department employees
  const getDepartmentEmployees = () => {
    if (!department.employeeIds || department.employeeIds.length === 0) {
      return [];
    }
    
    return employees.filter(emp => department.employeeIds.includes(emp.id))
      .map(emp => `${emp.firstName} ${emp.lastName}`);
  };
  
  const departmentEmployees = getDepartmentEmployees();

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Détails du département</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-sm">ID</h3>
            <p className="text-sm text-gray-500">{department.id}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm">Nom</h3>
            <p className="text-sm text-gray-500">{department.name}</p>
          </div>
          
          <div className="col-span-2">
            <h3 className="font-medium text-sm">Description</h3>
            <p className="text-sm text-gray-500">{department.description}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm">Manager</h3>
            <p className="text-sm text-gray-500">{department.managerName || 'Aucun manager'}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm">Entreprise</h3>
            <p className="text-sm text-gray-500">{getCompanyName()}</p>
          </div>
          
          <div className="col-span-2">
            <h3 className="font-medium text-sm">Couleur</h3>
            <div className="flex items-center mt-1">
              <div
                className="w-6 h-6 rounded-full mr-2"
                style={{ backgroundColor: department.color || '#6366F1' }}
              ></div>
              <span className="text-sm text-gray-500">{department.color || '#6366F1'}</span>
            </div>
          </div>
          
          <div className="col-span-2">
            <h3 className="font-medium text-sm">Employés ({departmentEmployees.length})</h3>
            {departmentEmployees.length > 0 ? (
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-500">
                {departmentEmployees.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Aucun employé</p>
            )}
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button onClick={onClose}>Fermer</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ViewDepartmentDialog;
