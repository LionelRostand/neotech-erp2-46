
import React from 'react';
import { BarChart } from '@/components/ui/charts';
import { useHrModuleData } from '@/hooks/useHrModuleData';

export const HeadcountByDepartment = () => {
  const { employees, departments } = useHrModuleData();
  
  const data = {
    labels: departments?.map(dept => dept.name) || [],
    datasets: [{
      label: 'Nombre d\'employés',
      data: departments?.map(dept => 
        employees?.filter(emp => emp.department === dept.id || emp.departmentId === dept.id).length
      ) || [],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  };

  return (
    <div className="h-[300px]">
      <BarChart data={data} />
    </div>
  );
};
