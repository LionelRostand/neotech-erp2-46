
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface LeaveBalanceCardProps {
  conges: {
    acquired: number;
    taken: number;
    balance: number;
  };
  rtt?: {
    acquired: number;
    taken: number;
    balance: number;
  };
}

const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({ conges, rtt = { acquired: 0, taken: 0, balance: 0 } }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold text-md mb-3">Solde des congés</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Congés payés</h4>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-gray-600">Acquis:</span>
              <span className="text-right">{conges.acquired.toFixed(2)} jours</span>
              <span className="text-gray-600">Pris:</span>
              <span className="text-right">{conges.taken.toFixed(2)} jours</span>
              <span className="text-gray-600 font-medium">Solde:</span>
              <span className="text-right font-medium">{conges.balance.toFixed(2)} jours</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">RTT</h4>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-gray-600">Acquis:</span>
              <span className="text-right">{rtt.acquired.toFixed(2)} jours</span>
              <span className="text-gray-600">Pris:</span>
              <span className="text-right">{rtt.taken.toFixed(2)} jours</span>
              <span className="text-gray-600 font-medium">Solde:</span>
              <span className="text-right font-medium">{rtt.balance.toFixed(2)} jours</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveBalanceCard;
