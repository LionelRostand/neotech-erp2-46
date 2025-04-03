
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SunMedium, Umbrella, Stethoscope } from 'lucide-react';

const LeaveBalanceCards: React.FC = () => {
  // Dans une application réelle, ces données viendraient d'une API
  const leaveBalance = {
    paid: 25,
    unpaid: 5,
    sick: 12,
    usedPaid: 10,
    usedUnpaid: 1,
    usedSick: 3,
  };
  
  // Calculer les pourcentages d'utilisation
  const paidPercentage = Math.round((leaveBalance.usedPaid / leaveBalance.paid) * 100);
  const unpaidPercentage = Math.round((leaveBalance.usedUnpaid / leaveBalance.unpaid) * 100);
  const sickPercentage = Math.round((leaveBalance.usedSick / leaveBalance.sick) * 100);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <SunMedium className="h-4 w-4 mr-2 text-amber-500" />
            Congés payés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {leaveBalance.paid - leaveBalance.usedPaid}
                <span className="text-sm font-normal text-gray-500 ml-1">/ {leaveBalance.paid}</span>
              </p>
              <p className="text-xs text-gray-500">jours restants</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-700 text-sm font-medium">{paidPercentage}%</span>
            </div>
          </div>
          <div className="mt-2 h-2 bg-amber-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full" 
              style={{ width: `${paidPercentage}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Umbrella className="h-4 w-4 mr-2 text-blue-500" />
            Congés sans solde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {leaveBalance.unpaid - leaveBalance.usedUnpaid}
                <span className="text-sm font-normal text-gray-500 ml-1">/ {leaveBalance.unpaid}</span>
              </p>
              <p className="text-xs text-gray-500">jours restants</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 text-sm font-medium">{unpaidPercentage}%</span>
            </div>
          </div>
          <div className="mt-2 h-2 bg-blue-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${unpaidPercentage}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Stethoscope className="h-4 w-4 mr-2 text-red-500" />
            Congés maladie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {leaveBalance.sick - leaveBalance.usedSick}
                <span className="text-sm font-normal text-gray-500 ml-1">/ {leaveBalance.sick}</span>
              </p>
              <p className="text-xs text-gray-500">jours restants</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-700 text-sm font-medium">{sickPercentage}%</span>
            </div>
          </div>
          <div className="mt-2 h-2 bg-red-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 rounded-full" 
              style={{ width: `${sickPercentage}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveBalanceCards;
