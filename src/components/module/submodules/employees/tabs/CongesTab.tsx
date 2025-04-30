
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Employee } from '@/types/employee';
import { useLeaveData } from '@/hooks/useLeaveData';

interface CongesTabProps {
  employee: Employee;
}

const CongesTab: React.FC<CongesTabProps> = ({ employee }) => {
  const { leaves = [] } = useLeaveData();
  
  // Filter leaves for this employee
  const employeeLeaves = Array.isArray(leaves) 
    ? leaves.filter(leave => leave.employeeId === employee.id)
    : [];
  
  // Get leave balances from employee data or set default values
  const conges = employee.conges || { acquired: 25, taken: 0, balance: 25 };
  const rtt = employee.rtt || { acquired: 12, taken: 0, balance: 12 };
  
  // Calculate percentages for progress bars
  const congesPercentage = conges.acquired > 0 ? Math.round((conges.taken / conges.acquired) * 100) : 0;
  const rttPercentage = rtt.acquired > 0 ? Math.round((rtt.taken / rtt.acquired) * 100) : 0;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Congés payés balance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Congés Payés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Jours acquis</span>
                <span className="font-semibold">{conges.acquired} jours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Jours pris</span>
                <span className="font-semibold">{conges.taken} jours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Solde</span>
                <span className="font-semibold text-green-600">{conges.balance} jours</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Utilisation</span>
                  <span>{congesPercentage}%</span>
                </div>
                <Progress value={congesPercentage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* RTT balance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">RTT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Jours acquis</span>
                <span className="font-semibold">{rtt.acquired} jours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Jours pris</span>
                <span className="font-semibold">{rtt.taken} jours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Solde</span>
                <span className="font-semibold text-green-600">{rtt.balance} jours</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Utilisation</span>
                  <span>{rttPercentage}%</span>
                </div>
                <Progress value={rttPercentage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent leave requests */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Demandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {employeeLeaves.length > 0 ? (
            <div className="space-y-4">
              {employeeLeaves.slice(0, 5).map((leave) => (
                <div key={leave.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{leave.type}</p>
                    <p className="text-sm text-gray-500">
                      {leave.startDate} - {leave.endDate} • {leave.days} jour(s)
                    </p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      leave.status === 'Approuvé' || leave.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : leave.status === 'Refusé' || leave.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Aucune demande de congés trouvée</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CongesTab;
