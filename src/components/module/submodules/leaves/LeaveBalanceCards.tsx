
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SunMedium, Clock, Calendar, Flag } from 'lucide-react';

export const LeaveBalanceCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <SunMedium className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Congés payés</p>
            <div className="flex items-end">
              <span className="text-2xl font-bold">18</span>
              <span className="text-sm text-gray-500 ml-1">/ 25 jours</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">RTT</p>
            <div className="flex items-end">
              <span className="text-2xl font-bold">6</span>
              <span className="text-sm text-gray-500 ml-1">/ 12 jours</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <Calendar className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Maladie</p>
            <div className="flex items-end">
              <span className="text-2xl font-bold">3</span>
              <span className="text-sm text-gray-500 ml-1">jours pris</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Flag className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Congés spéciaux</p>
            <div className="flex items-end">
              <span className="text-2xl font-bold">2</span>
              <span className="text-sm text-gray-500 ml-1">/ 5 jours</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
