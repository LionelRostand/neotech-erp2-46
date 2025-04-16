
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import LeaveBalanceEditor from './LeaveBalanceEditor';
import { Button } from '@/components/ui/button';
import { Edit2, Save } from 'lucide-react';

interface CongesTabProps {
  employee: Employee;
}

const CongesTab: React.FC<CongesTabProps> = ({ employee }) => {
  const [isEditing, setIsEditing] = useState(false);
  
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

  // Fonction appelée après la mise à jour réussie
  const handleUpdateSuccess = () => {
    setIsEditing(false);
    // Note: La mise à jour de l'UI se fait automatiquement grâce aux souscriptions Firebase
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Congés payés</h3>
          
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <LeaveBalanceEditor 
            employee={employee} 
            onUpdateSuccess={handleUpdateSuccess} 
          />
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default CongesTab;
