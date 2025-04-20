
import React from 'react';
import { BarChart } from '@/components/ui/charts';

interface ActivityChartProps {
  data: Array<{date: string; count: number}>;
  isLoading?: boolean;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="h-[300px] bg-gray-100 animate-pulse rounded-md"></div>;
  }

  if (!data || data.length === 0) {
    return <p className="text-muted-foreground text-center py-4">Aucune donnée d'activité disponible</p>;
  }

  // Prepare chart data
  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    }),
    datasets: [
      {
        label: 'Messages',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <BarChart 
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      }}
      height={300}
    />
  );
};

export default ActivityChart;
