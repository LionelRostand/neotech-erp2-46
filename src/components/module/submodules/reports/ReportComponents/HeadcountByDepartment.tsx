
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
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 8,
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 20,
        top: 0,
        bottom: 10
      }
    }
  };

  return (
    <div className="w-full h-full">
      <BarChart data={data} options={options} />
    </div>
  );
};
