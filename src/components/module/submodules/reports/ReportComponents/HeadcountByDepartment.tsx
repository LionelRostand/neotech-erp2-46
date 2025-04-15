
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

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="w-full h-[350px] p-4">
      <BarChart data={data} options={options} />
    </div>
  );
};
