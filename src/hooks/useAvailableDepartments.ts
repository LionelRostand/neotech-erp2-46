
import { useState, useEffect } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { Department } from '@/components/module/submodules/departments/types';

export const useAvailableDepartments = () => {
  const { departments = [], isLoading } = useHrModuleData();
  const [availableDepartments, setAvailableDepartments] = useState<Department[]>([]);

  useEffect(() => {
    // Make sure departments is an array before processing
    if (departments && Array.isArray(departments)) {
      // Format departments to ensure they have required fields
      const formattedDepartments = departments.map(dept => ({
        id: dept.id || '',
        name: dept.name || 'Département sans nom',
        description: dept.description || '',
        managerId: dept.managerId || '',
        managerName: dept.managerName || '',
        employeeIds: Array.isArray(dept.employeeIds) ? dept.employeeIds : [],
        employeesCount: dept.employeesCount || 0,
        color: dept.color || '#3b82f6',
        companyId: dept.companyId || ''
      }));
      
      setAvailableDepartments(formattedDepartments);
    } else {
      console.log('No departments data available or invalid format');
      // If departments is not an array, set an empty array
      setAvailableDepartments([]);
    }
  }, [departments]);

  return {
    departments: availableDepartments,
    isLoading
  };
};
