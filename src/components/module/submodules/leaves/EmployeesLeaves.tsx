
import React, { useState } from 'react';
import { useLeaveData } from '@/hooks/useLeaveData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import CreateLeaveDialog from './CreateLeaveDialog';

const getLeaveTypeName = (type: string): string => {
  switch (type) {
    case 'paid': return 'Congés payés';
    case 'rtt': return 'RTT';
    case 'rtte': return 'RTTe';
    case 'unpaid': return 'Sans solde';
    case 'sick': return 'Maladie';
    case 'family': return 'Familial';
    case 'other': return 'Autre';
    default: return type;
  }
};

const EmployeesLeaves: React.FC = () => {
  const { leaves, stats, isLoading, refetch } = useLeaveData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculer les stats pour le dashboard
  const pendingLeaves = leaves.filter(leave => leave.status === 'En attente' || leave.status === 'pending');
  const approvedLeaves = leaves.filter(leave => leave.status === 'Approuvé' || leave.status === 'approved');
  const rejectedLeaves = leaves.filter(leave => leave.status === 'Refusé' || leave.status === 'rejected');

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestion des congés</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle demande
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Demandes en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLeaves.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Demandes approuvées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedLeaves.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Demandes refusées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedLeaves.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Toutes les demandes</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="approved">Approuvées</TabsTrigger>
          <TabsTrigger value="rejected">Refusées</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <LeavesTable leaves={leaves} />
        </TabsContent>
        <TabsContent value="pending">
          <LeavesTable leaves={pendingLeaves} />
        </TabsContent>
        <TabsContent value="approved">
          <LeavesTable leaves={approvedLeaves} />
        </TabsContent>
        <TabsContent value="rejected">
          <LeavesTable leaves={rejectedLeaves} />
        </TabsContent>
      </Tabs>

      <CreateLeaveDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={refetch}
      />
    </div>
  );
};

interface LeavesTableProps {
  leaves: any[];
}

const LeavesTable: React.FC<LeavesTableProps> = ({ leaves }) => {
  if (leaves.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-md">
        <p className="text-gray-500">Aucune demande de congé pour cette catégorie.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-sm">Employé</th>
            <th className="px-4 py-2 text-left text-sm">Type</th>
            <th className="px-4 py-2 text-left text-sm">Début</th>
            <th className="px-4 py-2 text-left text-sm">Fin</th>
            <th className="px-4 py-2 text-left text-sm">Jours</th>
            <th className="px-4 py-2 text-left text-sm">Raison</th>
            <th className="px-4 py-2 text-left text-sm">Statut</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{leave.employeeName}</td>
              <td className="px-4 py-2">{getLeaveTypeName(leave.type)}</td>
              <td className="px-4 py-2">{leave.startDate}</td>
              <td className="px-4 py-2">{leave.endDate}</td>
              <td className="px-4 py-2">{leave.days}</td>
              <td className="px-4 py-2">{leave.reason || '-'}</td>
              <td className="px-4 py-2">
                <StatusBadge status={leave.status}>{leave.status}</StatusBadge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeesLeaves;
