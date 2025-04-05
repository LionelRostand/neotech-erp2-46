
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { useLeaveBalances } from '@/hooks/useLeaveBalances';

const LeaveBalanceCards: React.FC = () => {
  const { leaveBalances, isLoading, error } = useLeaveBalances();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        <p className="ml-2 text-gray-500">Chargement des soldes de congés...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Une erreur est survenue lors du chargement des soldes de congés.
      </div>
    );
  }

  // Group balances by type
  const balancesByType = leaveBalances.reduce((acc, balance) => {
    if (!acc[balance.type]) {
      acc[balance.type] = {
        type: balance.type,
        total: balance.total,
        used: balance.used,
        remaining: balance.remaining
      };
    }
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.values(balancesByType).map((balance: any, index) => (
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
