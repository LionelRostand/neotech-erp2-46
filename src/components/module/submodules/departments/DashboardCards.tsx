
import React from 'react';
import { Department } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardCardsProps {
  departments: Department[];
  loading: boolean;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ departments, loading }) => {
  // Create data for the pie chart
  const departmentsByColor = React.useMemo(() => {
    if (loading || !departments.length) return {};

    return departments.reduce((acc: Record<string, number>, dept) => {
      if (dept.color) {
        acc[dept.color] = (acc[dept.color] || 0) + 1;
      }
      return acc;
    }, {});
  }, [departments, loading]);

  const chartData = React.useMemo(() => {
    const colors = Object.keys(departmentsByColor);
    
    return {
      labels: colors.map(color => {
        // Find departments with this color to list in tooltip
        const depts = departments.filter(d => d.color === color).map(d => d.name).slice(0, 3);
        const label = depts.join(', ') + (departments.filter(d => d.color === color).length > 3 ? '...' : '');
        return label;
      }),
      datasets: [
        {
          data: Object.values(departmentsByColor),
          backgroundColor: colors,
          borderColor: colors.map(color => color),
          borderWidth: 1,
        },
      ],
    };
  }, [departmentsByColor, departments]);

  // Stats cards data
  const stats = React.useMemo(() => {
    if (loading) return { total: 0, withManager: 0, withEmployees: 0 };

    const total = departments.length;
    const withManager = departments.filter(dept => dept.managerId).length;
    const withEmployees = departments.filter(dept => dept.employeesCount > 0).length;

    return { total, withManager, withEmployees };
  }, [departments, loading]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="h-64 bg-gray-100 animate-pulse"></Card>
        <Card className="h-64 bg-gray-100 animate-pulse"></Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Distribution par couleur</h3>
          <div className="h-56">
            {Object.keys(departmentsByColor).length > 0 ? (
              <Pie 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw as number;
                          const percentage = Math.round((value / departments.length) * 100);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Statistiques des départements</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Départements avec manager</span>
                <span className="text-sm font-medium">{stats.withManager}/{stats.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${stats.total ? (stats.withManager / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Départements avec employés</span>
                <span className="text-sm font-medium">{stats.withEmployees}/{stats.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${stats.total ? (stats.withEmployees / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {departments.slice(0, 6).map(dept => (
                <div key={dept.id} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: dept.color || '#cccccc' }}
                  ></div>
                  <span className="text-sm truncate" title={dept.name}>
                    {dept.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
