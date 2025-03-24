
import React from 'react';

export const LeaveBalanceCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 border rounded-md">
        <div className="text-sm text-gray-500 mb-1">Congés payés</div>
        <div className="flex items-end">
          <div className="text-2xl font-bold">15</div>
          <div className="text-sm text-gray-500 ml-1">/ 25 jours</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
        </div>
      </div>
      
      <div className="bg-white p-4 border rounded-md">
        <div className="text-sm text-gray-500 mb-1">RTT</div>
        <div className="flex items-end">
          <div className="text-2xl font-bold">8</div>
          <div className="text-sm text-gray-500 ml-1">/ 12 jours</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '67%' }}></div>
        </div>
      </div>
      
      <div className="bg-white p-4 border rounded-md">
        <div className="text-sm text-gray-500 mb-1">Demandes en attente</div>
        <div className="text-2xl font-bold">3</div>
        <div className="text-xs text-amber-600 mt-2">
          2 demandes à approuver
        </div>
      </div>
      
      <div className="bg-white p-4 border rounded-md">
        <div className="text-sm text-gray-500 mb-1">Congés approuvés (mois)</div>
        <div className="text-2xl font-bold">7</div>
        <div className="text-xs text-gray-500 mt-2">
          Sur 15 demandes ce mois-ci
        </div>
      </div>
    </div>
  );
};
