
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

const LeaveBalanceCards: React.FC = () => {
  const { employees, leaveRequests, isLoading } = useHrModuleData();
  
  // Calculate leave balances based on employee data and leave requests
  const leaveBalances = useMemo(() => {
    if (!employees || !leaveRequests) return [];
    
    // Default leave policies
    const defaultPolicies = {
      'Congés payés': 25,
      'RTT': 12,
      'Congés maladie': 0,
      'Congés spéciaux': 3,
    };
    
    // Calculate used days for each leave type
    const usedDaysByType = leaveRequests.reduce((acc, request) => {
      if (request.status === 'approved' || request.status === 'Approuvé') {
        const type = request.type || 'Congés payés';
        const days = request.durationDays || 1;
        
        if (!acc[type]) acc[type] = 0;
        acc[type] += days;
      }
      return acc;
    }, {});
    
    // Prepare the balance data
    return Object.entries(defaultPolicies).map(([type, total]) => {
      const used = usedDaysByType[type] || 0;
      const remaining = type === 'Congés maladie' ? 0 : Math.max(0, total - used);
      
      return {
        type,
        total,
        used,
        remaining
      };
    });
  }, [employees, leaveRequests]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        <p className="ml-2 text-gray-500">Chargement des soldes de congés...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {leaveBalances.map((balance, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-3">{balance.type}</h3>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-3xl font-bold">{balance.remaining}</span>
                <span className="text-sm text-gray-500">Jours restants</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{balance.used}</span> utilisés
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{balance.total}</span> total
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Progress 
                value={(balance.used / balance.total) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LeaveBalanceCards;
