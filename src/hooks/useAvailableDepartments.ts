
import { useState, useEffect } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { Department } from '@/components/module/submodules/departments/types';

export const useAvailableDepartments = () => {
  const { departments = [], isLoading } = useHrModuleData();
  const [availableDepartments, setAvailableDepartments] = useState<Department[]>([]);

  useEffect(() => {
    if (departments && Array.isArray(departments)) {
      // Format departments to ensure they have required fields and valid IDs
      const formattedDepartments = departments
        .filter(dept => dept && dept.id && dept.id.trim() !== '') // Ensure we have a valid ID
        .map(dept => ({
          id: dept.id || `dept-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: dept.name || 'Département sans nom',
          description: dept.description || '',
          managerId: dept.managerId || '',
          managerName: dept.managerName || '',
          employeeIds: Array.isArray(dept.employeeIds) ? dept.employeeIds : [],
          employeesCount: dept.employeesCount || 0,
          color: dept.color || '#3b82f6',
          companyId: dept.companyId || 'default-company'
        }));
      
      setAvailableDepartments(formattedDepartments);
    } else {
      setAvailableDepartments([]);
    }
  }, [departments]);

  return {
    departments: availableDepartments,
    isLoading
  };
};
