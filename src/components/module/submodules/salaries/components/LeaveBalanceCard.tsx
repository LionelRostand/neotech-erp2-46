
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LeaveBalanceProps {
  conges: {
    acquired: number;
    taken: number;
    balance: number;
  };
  rtt: {
    acquired: number;
    taken: number;
    balance: number;
  };
}

const LeaveBalanceCard: React.FC<LeaveBalanceProps> = ({ conges, rtt }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-4">Soldes de congés</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Congés payés</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="border rounded p-2">
                <div className="text-gray-500 text-xs">Acquis</div>
                <div className="font-medium">{conges.acquired} jours</div>
              </div>
              <div className="border rounded p-2">
                <div className="text-gray-500 text-xs">Pris</div>
                <div className="font-medium">{conges.taken} jours</div>
              </div>
              <div className="border rounded bg-gray-50 p-2">
                <div className="text-gray-500 text-xs">Solde</div>
                <div className="font-medium">{conges.balance} jours</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">RTT</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="border rounded p-2">
                <div className="text-gray-500 text-xs">Acquis</div>
                <div className="font-medium">{rtt.acquired} jours</div>
              </div>
              <div className="border rounded p-2">
                <div className="text-gray-500 text-xs">Pris</div>
                <div className="font-medium">{rtt.taken} jours</div>
              </div>
              <div className="border rounded bg-gray-50 p-2">
                <div className="text-gray-500 text-xs">Solde</div>
                <div className="font-medium">{rtt.balance} jours</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveBalanceCard;
