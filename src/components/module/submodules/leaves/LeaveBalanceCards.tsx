
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SunMedium, Clock, Calendar } from 'lucide-react';

export const LeaveBalanceCards: React.FC = () => {
  // In a real app, this would be fetched from Firebase
  const balances = {
    paid: 25,
    sick: 12,
    specialLeave: 5,
    usedPaid: 10,
    usedSick: 2,
    usedSpecial: 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Congés payés</h3>
            <p className="text-2xl font-bold">{balances.paid - balances.usedPaid} / {balances.paid}</p>
            <p className="text-xs text-gray-500">{balances.usedPaid} jours utilisés</p>
          </div>
          <SunMedium className="h-10 w-10 text-yellow-500" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Congés maladie</h3>
            <p className="text-2xl font-bold">{balances.sick - balances.usedSick} / {balances.sick}</p>
            <p className="text-xs text-gray-500">{balances.usedSick} jours utilisés</p>
          </div>
          <Clock className="h-10 w-10 text-blue-500" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Congés exceptionnels</h3>
            <p className="text-2xl font-bold">{balances.specialLeave - balances.usedSpecial} / {balances.specialLeave}</p>
            <p className="text-xs text-gray-500">{balances.usedSpecial} jours utilisés</p>
          </div>
          <Calendar className="h-10 w-10 text-purple-500" />
        </CardContent>
      </Card>
    </div>
  );
};
