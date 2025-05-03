
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee } from '@/types/employee';

interface LeaveStatsProps {
  leaveRequests: any[];
  employees: Employee[];
}

const LeaveStats: React.FC<LeaveStatsProps> = ({ leaveRequests, employees }) => {
  // Calculer les statistiques par type de congé
  const leaveTypeStats = leaveRequests.reduce((acc, request) => {
    const type = request.type || 'other';
    if (!acc[type]) acc[type] = 0;
    acc[type] += 1;
    return acc;
  }, {} as Record<string, number>);

  // Types de congés pour l'affichage
  const leaveTypes = {
    paid: { label: 'Congés payés', color: 'bg-blue-500' },
    unpaid: { label: 'Congés sans solde', color: 'bg-purple-500' },
    sick: { label: 'Congés maladie', color: 'bg-orange-500' },
    maternity: { label: 'Congés maternité', color: 'bg-pink-500' },
    paternity: { label: 'Congés paternité', color: 'bg-indigo-500' },
    other: { label: 'Autres congés', color: 'bg-teal-500' },
  };

  // Calculer le total des congés
  const totalLeaves = Object.values(leaveTypeStats).reduce((sum, count) => sum + count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques des congés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(leaveTypes).map(([key, { label, color }]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <div>
                <span className="font-medium">{label}:</span>{' '}
                <span>{leaveTypeStats[key] || 0}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            {Object.entries(leaveTypes).map(([key, { color }], index) => {
              const percentage = totalLeaves ? (leaveTypeStats[key] || 0) / totalLeaves * 100 : 0;
              const prevPercentages = Object.entries(leaveTypes)
                .slice(0, index)
                .reduce((sum, [prevKey]) => sum + (totalLeaves ? (leaveTypeStats[prevKey] || 0) / totalLeaves * 100 : 0), 0);
              
              return (
                <div 
                  key={key}
                  className={`h-2.5 rounded-full ${color}`} 
                  style={{ 
                    width: `${percentage}%`,
                    marginLeft: index === 0 ? 0 : `${prevPercentages}%`,
                    position: index === 0 ? 'relative' : 'absolute',
                    top: 0,
                  }}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveStats;
