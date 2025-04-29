
import { useState, useEffect } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { Department } from '@/components/module/submodules/departments/types';

export const useAvailableDepartments = () => {
  const { departments = [], isLoading } = useHrModuleData();
  const [availableDepartments, setAvailableDepartments] = useState<Department[]>([]);

  useEffect(() => {
    if (departments && Array.isArray(departments)) {
      setAvailableDepartments(departments);
    }
  }, [departments]);

  return {
    departments: availableDepartments,
    isLoading
  };
};
