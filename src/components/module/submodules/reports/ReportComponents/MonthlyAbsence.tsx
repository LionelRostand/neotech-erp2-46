
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
      backgroundColor: 'rgba(234, 88, 12, 0.1)',
      tension: 0.3,
      fill: true
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
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
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
      <LineChart data={data} options={options} />
    </div>
  );
};
