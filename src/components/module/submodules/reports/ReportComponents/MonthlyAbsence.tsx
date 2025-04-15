
import React from 'react';
import { LineChart } from '@/components/ui/charts';
import { useAbsencesData } from '@/hooks/useAbsencesData';

export const MonthlyAbsence = () => {
  const { absences } = useAbsencesData();
  
  const monthlyData = Array(12).fill(0);
  absences.forEach(absence => {
    const month = new Date(absence.startDate).getMonth();
    monthlyData[month]++;
  });

  const data = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [{
      label: 'Absences',
      data: monthlyData,
      borderColor: 'rgb(234, 88, 12)',
      backgroundColor: 'rgba(234, 88, 12, 0.5)',
      tension: 0.3
    }]
  };

  return (
    <div className="h-[300px]">
      <LineChart data={data} />
    </div>
  );
};
