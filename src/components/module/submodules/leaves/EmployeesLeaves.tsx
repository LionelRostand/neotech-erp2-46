
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getLeaveRequests } from './services/leaveService';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import LeaveRequestsTable from './LeaveRequestsTable';
import CreateLeaveDialog from './CreateLeaveDialog';
import LeaveStats from './LeaveStats';
import LeaveSummaryCard from './LeaveSummaryCard';

const EmployeesLeaves = () => {
  const { employees } = useHrModuleData();
  const [isLoading, setIsLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const requests = await getLeaveRequests();
      setLeaveRequests(requests);
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes de congés:", error);
      toast.error("Échec de la récupération des demandes de congés");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleRefresh = () => {
    fetchLeaveRequests();
    toast.success("Données des congés actualisées");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des congés</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <LeaveSummaryCard title="Congés en attente" count={leaveRequests.filter(r => r.status === 'pending').length} status="pending" />
        <LeaveSummaryCard title="Congés approuvés" count={leaveRequests.filter(r => r.status === 'approved').length} status="approved" />
        <LeaveSummaryCard title="Congés rejetés" count={leaveRequests.filter(r => r.status === 'rejected').length} status="rejected" />
        <LeaveSummaryCard title="Congés annulés" count={leaveRequests.filter(r => r.status === 'canceled').length} status="canceled" />
      </div>

      <LeaveStats leaveRequests={leaveRequests} employees={employees} />
      
      <div className="mt-8">
        <LeaveRequestsTable 
          leaveRequests={leaveRequests} 
          isLoading={isLoading} 
          onSuccess={fetchLeaveRequests}
        />
      </div>
      
      <CreateLeaveDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchLeaveRequests}
        employees={employees}
      />
    </>
  );
};

export default EmployeesLeaves;
