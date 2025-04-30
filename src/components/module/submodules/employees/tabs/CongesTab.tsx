
import React from 'react';
import { Employee, LeaveRequest } from '@/types/employee';
import { StatusBadge } from '@/components/module/submodules/StatusBadge';
import { useLeaveData } from '@/hooks/useLeaveData';

interface CongesTabProps {
  employee: Employee;
}

const CongesTab: React.FC<CongesTabProps> = ({ employee }) => {
  // Fetch all leaves and filter by employee
  const { leaves = [] } = useLeaveData();
  const employeeLeaves = Array.isArray(leaves) 
    ? leaves.filter(leave => leave && leave.employeeId === employee.id)
    : [];

  // Ensure conges is an object with the expected properties
  const conges = employee.conges || {
    acquired: 25,
    taken: 0,
    balance: 25
  };

  // Ensure rtt is an object with the expected properties
  const rtt = employee.rtt || {
    acquired: 10,
    taken: 0,
    balance: 10
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-lg">Congés payés</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500">Acquis</div>
              <div className="font-medium text-lg">{conges.acquired}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Pris</div>
              <div className="font-medium text-lg">{conges.taken}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Solde</div>
              <div className="font-medium text-lg">{conges.balance}</div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-lg">RTT</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500">Acquis</div>
              <div className="font-medium text-lg">{rtt.acquired}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Pris</div>
              <div className="font-medium text-lg">{rtt.taken}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Solde</div>
              <div className="font-medium text-lg">{rtt.balance}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Demandes de congé</h3>
        
        {employeeLeaves && employeeLeaves.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Début
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fin
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jours
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeLeaves.map((leave, index) => (
                  <tr key={leave.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {leave.type || 'Congés payés'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {leave.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {leave.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {leave.days || 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatus(leave.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">
              Aucune demande de congé n'a été enregistrée pour cet employé.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to render status badges
const renderStatus = (status: string) => {
  let variant = "default";
  
  if (status === "Approuvé" || status === "approved") variant = "success";
  if (status === "En attente" || status === "pending") variant = "warning";
  if (status === "Refusé" || status === "rejected") variant = "destructive";
  
  return <StatusBadge status={status} variant={variant}>{status}</StatusBadge>;
};

export default CongesTab;
