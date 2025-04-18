
import React from 'react';
import { BarChart } from '@/components/ui/charts';
import { useHrModuleData } from '@/hooks/useHrModuleData';

export const SeniorityChart = () => {
  const { employees } = useHrModuleData();
  
  const calculateSeniority = (hireDate: string) => {
    const hire = new Date(hireDate);
    const now = new Date();
    return Math.floor((now.getTime() - hire.getTime()) / (1000 * 60 * 60 * 24 * 365));
  };

  const seniorityRanges = {
    '0-2 ans': 0,
    '2-5 ans': 0,
    '5-10 ans': 0,
    '10+ ans': 0
  };

  employees.forEach(emp => {
    if (emp.hireDate) {
      const seniority = calculateSeniority(emp.hireDate);
      if (seniority <= 2) seniorityRanges['0-2 ans']++;
      else if (seniority <= 5) seniorityRanges['2-5 ans']++;
      else if (seniority <= 10) seniorityRanges['5-10 ans']++;
      else seniorityRanges['10+ ans']++;
    }
  });

  const data = {
    labels: Object.keys(seniorityRanges),
    datasets: [{
      label: 'Nombre d\'employés',
      data: Object.values(seniorityRanges),
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
      borderColor: 'rgb(34, 197, 94)',
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
          padding: 15
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <div className="w-full h-full">
      <BarChart data={data} options={options} />
    </div>
  );
};
