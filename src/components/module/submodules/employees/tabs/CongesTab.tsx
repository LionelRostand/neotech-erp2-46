
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/types/employee';

interface CongesTabProps {
  employee: Employee;
}

const CongesTab: React.FC<CongesTabProps> = ({ employee }) => {
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

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-6">Congés payés</h3>
        
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
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Solde actuel</p>
                <p className="text-xl font-semibold text-green-600">{rtt.balance} jours</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CongesTab;
