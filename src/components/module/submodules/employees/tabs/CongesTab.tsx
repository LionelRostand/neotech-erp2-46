
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { Employee } from '@/types/employee';
import { useLeaveData } from '@/hooks/useLeaveData';
import { CreateLeaveRequestDialog } from '../../leaves/CreateLeaveRequestDialog';

interface CongesTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const CongesTab: React.FC<CongesTabProps> = ({ employee, isEditing, onFinishEditing }) => {
  const { leaves, refetch } = useLeaveData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Filtre les congés de l'employé actuel
  const employeeLeaves = leaves.filter(leave => leave.employeeId === employee.id);
  
  // Rafraîchir les données au chargement du composant
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved') || statusLower.includes('approuvé')) {
      return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
    }
    if (statusLower.includes('rejected') || statusLower.includes('refusé')) {
      return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
    }
    return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
  };
  
  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };
  
  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };
  
  const handleCreateLeaveRequest = async (data: any) => {
    console.log('Nouvelle demande créée:', data);
    await refetch();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Historique des congés</h3>
        <Button 
          size="sm" 
          onClick={handleOpenCreateDialog}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Demander un congé
        </Button>
      </div>
      
      {employeeLeaves.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Calendar className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">Aucun congé trouvé</h3>
            <p className="text-sm text-gray-500 mt-1">
              Cet employé n'a pas encore demandé de congé.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleOpenCreateDialog}
            >
              Demander un congé
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de demande</TableHead>
                  <TableHead>Motif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeLeaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.type}</TableCell>
                    <TableCell>
                      Du {leave.startDate} au {leave.endDate}
                    </TableCell>
                    <TableCell>{leave.days} jour(s)</TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    <TableCell>{leave.requestDate}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {leave.reason || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      <CreateLeaveRequestDialog
        isOpen={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSubmit={handleCreateLeaveRequest}
      />
    </div>
  );
};

export default CongesTab;
