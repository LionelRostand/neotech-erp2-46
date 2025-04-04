
import React from 'react';

interface LeaveBalanceCardProps {
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

const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({ conges, rtt }) => {
  return (
    <div className="bg-green-50 rounded-lg p-5">
      <div className="flex items-center mb-4">
        <div className="bg-green-100 rounded-full p-2 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <path d="M16 2v4"/>
            <path d="M8 2v4"/>
            <path d="M3 10h18"/>
            <path d="M9 16h6"/>
          </svg>
        </div>
        <h3 className="font-bold text-lg">Congés et RTT</h3>
      </div>
      
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-600">
            <th className="font-medium pb-2">Type</th>
            <th className="font-medium pb-2 text-center">Acquis</th>
            <th className="font-medium pb-2 text-center">Pris</th>
            <th className="font-medium pb-2 text-center">Solde</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2">Congés payés</td>
            <td className="py-2 text-center">{conges.acquired}</td>
            <td className="py-2 text-center">{conges.taken}</td>
            <td className="py-2 text-center font-medium">{conges.balance}</td>
          </tr>
          {rtt && (
            <tr>
              <td className="py-2">RTT</td>
              <td className="py-2 text-center">{rtt.acquired}</td>
              <td className="py-2 text-center">{rtt.taken}</td>
              <td className="py-2 text-center font-medium">{rtt.balance}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveBalanceCard;
