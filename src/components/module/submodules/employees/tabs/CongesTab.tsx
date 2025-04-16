
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import LeaveBalanceEditor from './LeaveBalanceEditor';
import { Button } from '@/components/ui/button';
import { Edit2, Save, AlertCircle, RefreshCw } from 'lucide-react';
import { useEmployeeLeavesDeduction } from '@/hooks/useEmployeeLeavesDeduction';
import { Badge } from '@/components/ui/badge';
import { useLeaveData } from '@/hooks/useLeaveData';

interface CongesTabProps {
  employee: Employee;
}

const CongesTab: React.FC<CongesTabProps> = ({ employee }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const conges = employee.conges || {
    acquired: 25,
    taken: 0,
    balance: 25
  };
  
  const rtt = employee.rtt || {
    acquired: 10,
    taken: 0,
    balance: 10
  };
  
  // Utiliser le hook pour la déduction des congés
  const { 
    approvedLeaves, 
    pendingDeductions, 
    deductApprovedLeaves, 
    isProcessing 
  } = useEmployeeLeavesDeduction(employee.id, employee);

  // Fonction appelée après la mise à jour réussie
  const handleUpdateSuccess = () => {
    setIsEditing(false);
    // Déclencher un rafraîchissement pour obtenir les dernières données
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Congés payés</h3>
          
          <div className="flex gap-2">
            {!isEditing && (
              <>
                {(pendingDeductions.conges > 0 || pendingDeductions.rtt > 0) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={deductApprovedLeaves}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    )}
                    Déduire les congés pris
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <LeaveBalanceEditor 
            employee={employee} 
            onUpdateSuccess={handleUpdateSuccess} 
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium mb-3">Congés annuels</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Acquis</p>
                    <p className="text-xl font-semibold">{conges.acquired} jours</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pris</p>
                    <p className="text-xl font-semibold">{conges.taken} jours</p>
                    {pendingDeductions.conges > 0 && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 mt-1">
                        + {pendingDeductions.conges} jours à déduire
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Solde actuel</p>
                    <p className="text-xl font-semibold text-green-600">{conges.balance} jours</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-3">RTT</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Acquis</p>
                    <p className="text-xl font-semibold">{rtt.acquired} jours</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pris</p>
                    <p className="text-xl font-semibold">{rtt.taken} jours</p>
                    {pendingDeductions.rtt > 0 && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 mt-1">
                        + {pendingDeductions.rtt} jours à déduire
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Solde actuel</p>
                    <p className="text-xl font-semibold text-green-600">{rtt.balance} jours</p>
                  </div>
                </div>
              </div>
            </div>
            
            {(approvedLeaves.length > 0) && (
              <div className="mt-6 border-t pt-6">
                <h4 className="text-md font-medium mb-3">Demandes de congés approuvées</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {approvedLeaves.map(leave => (
                    <div key={leave.id} className="p-3 bg-gray-50 rounded-md border flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{leave.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Du {leave.startDate} au {leave.endDate} ({leave.days} jour{leave.days > 1 ? 's' : ''})
                        </p>
                      </div>
                      <Badge variant={
                        leave.type.toLowerCase().includes('rtt') 
                          ? 'secondary' 
                          : 'default'
                      }>
                        {leave.days} jour{leave.days > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CongesTab;
