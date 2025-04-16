
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Employee } from '@/types/employee';
import { Calendar, Clock } from 'lucide-react';

interface CongesTabProps {
  employee: Employee;
}

const CongesTab: React.FC<CongesTabProps> = ({ employee }) => {
  const congesAcquis = employee.conges?.acquired || 0;
  const congesPris = employee.conges?.taken || 0;
  const congesRestants = employee.conges?.balance || 0;
  
  const rttAcquis = employee.rtt?.acquired || 0;
  const rttPris = employee.rtt?.taken || 0;
  const rttRestants = employee.rtt?.balance || 0;

  const congesPercentage = congesAcquis > 0 ? (congesPris / congesAcquis) * 100 : 0;
  const rttPercentage = rttAcquis > 0 ? (rttPris / rttAcquis) * 100 : 0;

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium flex items-center mb-4">
            <Calendar className="h-5 w-5 mr-2" />
            Congés payés
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted p-3 rounded">
                <p className="text-sm font-medium">Acquis</p>
                <p className="text-2xl font-bold">{congesAcquis} jours</p>
              </div>
              <div className="bg-muted p-3 rounded">
                <p className="text-sm font-medium">Pris</p>
                <p className="text-2xl font-bold">{congesPris} jours</p>
              </div>
              <div className="bg-muted p-3 rounded">
                <p className="text-sm font-medium">Restants</p>
                <p className="text-2xl font-bold">{congesRestants} jours</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Congés pris</span>
                <span className="text-sm font-medium">{congesPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={congesPercentage} />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium flex items-center mb-4">
            <Clock className="h-5 w-5 mr-2" />
            RTT
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted p-3 rounded">
                <p className="text-sm font-medium">Acquis</p>
                <p className="text-2xl font-bold">{rttAcquis} jours</p>
              </div>
              <div className="bg-muted p-3 rounded">
                <p className="text-sm font-medium">Pris</p>
                <p className="text-2xl font-bold">{rttPris} jours</p>
              </div>
              <div className="bg-muted p-3 rounded">
                <p className="text-sm font-medium">Restants</p>
                <p className="text-2xl font-bold">{rttRestants} jours</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">RTT pris</span>
                <span className="text-sm font-medium">{rttPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={rttPercentage} />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Historique des demandes</h3>
          
          {employee.leaveRequests && employee.leaveRequests.length > 0 ? (
            <div className="space-y-3">
              {employee.leaveRequests.map((request, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded">
                  <div>
                    <p className="font-medium">{request.type}</p>
                    <p className="text-sm text-muted-foreground">
                      Du {new Date(request.startDate).toLocaleDateString()} au {new Date(request.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      request.status === 'approved' || request.status === 'Approuvé' 
                        ? 'bg-green-100 text-green-800' 
                        : request.status === 'pending' || request.status === 'En attente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune demande enregistrée</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CongesTab;
