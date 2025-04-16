
import React from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent } from '@/components/ui/card';

interface CongesTabProps {
  employee: Employee;
}

const CongesTab: React.FC<CongesTabProps> = ({ employee }) => {
  // Default congés values if not provided
  const conges = employee.conges || {
    acquired: 0,
    taken: 0,
    balance: 0
  };
  
  // Default RTT values if not provided
  const rtt = employee.rtt || {
    acquired: 0,
    taken: 0,
    balance: 0
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Congés de {employee.firstName} {employee.lastName}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Congés payés</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Acquis:</span>
                <span>{conges.acquired} jours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pris:</span>
                <span>{conges.taken} jours</span>
              </div>
              <div className="flex justify-between font-medium mt-4 pt-2 border-t">
                <span>Solde:</span>
                <span>{conges.balance} jours</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">RTT</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Acquis:</span>
                <span>{rtt.acquired} jours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pris:</span>
                <span>{rtt.taken} jours</span>
              </div>
              <div className="flex justify-between font-medium mt-4 pt-2 border-t">
                <span>Solde:</span>
                <span>{rtt.balance} jours</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted p-6 rounded-md text-center mt-6">
        <p className="text-muted-foreground">
          L'historique des demandes de congés sera disponible prochainement.
        </p>
      </div>
    </div>
  );
};

export default CongesTab;
