
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const LeaveBalanceCards: React.FC = () => {
  // Sample leave balance data
  const leaveBalances = [
    { type: 'Congés payés', total: 25, used: 8, remaining: 17 },
    { type: 'RTT', total: 12, used: 4, remaining: 8 },
    { type: 'Congés maladie', total: 0, used: 2, remaining: 0 },
    { type: 'Congés spéciaux', total: 3, used: 0, remaining: 3 },
  ];

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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LeaveBalanceCards;
