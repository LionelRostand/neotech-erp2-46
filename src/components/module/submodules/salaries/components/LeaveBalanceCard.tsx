
import React from 'react';

interface LeaveBalanceCardProps {
  period: string;
}

const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({ period }) => {
  return (
    <div className="border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-full p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
              <path d="M8 14h.01"/>
              <path d="M12 14h.01"/>
              <path d="M16 14h.01"/>
              <path d="M8 18h.01"/>
              <path d="M12 18h.01"/>
              <path d="M16 18h.01"/>
            </svg>
          </div>
          <h3 className="font-bold text-lg">Congés disponibles</h3>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">17,25 jours</p>
          <p className="text-xs text-gray-500">0,00 jours posés en {period}</p>
        </div>
      </div>
      
      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <p className="font-medium">CP N-2</p>
            <p className="font-medium">0,00 jours</p>
          </div>
          <div className="flex justify-between text-sm">
            <p>+ Acquis</p>
            <p>5,00 j</p>
          </div>
          <div className="flex justify-between text-sm">
            <p>- Pris</p>
            <p>5,00 j</p>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <p className="font-medium">CP N-1</p>
            <p className="font-medium">0,00 jours</p>
          </div>
          <div className="flex justify-between text-sm">
            <p>+ Acquis</p>
            <p>25,00 j</p>
          </div>
          <div className="flex justify-between text-sm">
            <p>- Pris</p>
            <p>25,00 j</p>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <p className="font-medium">CP N</p>
            <p className="font-medium">17,25 jours</p>
          </div>
          <div className="flex justify-between text-sm">
            <p>+ Acquis</p>
            <p>18,75 j</p>
          </div>
          <div className="flex justify-between text-sm">
            <p>- Pris</p>
            <p>1,50 j</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveBalanceCard;
