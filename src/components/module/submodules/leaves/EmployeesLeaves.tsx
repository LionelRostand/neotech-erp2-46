
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getLeaveRequests, LeaveRequest } from './services/leaveService';
import LeaveRequestsTable from './LeaveRequestsTable';
import CreateLeaveDialog from './CreateLeaveDialog';
import LeaveStats from './LeaveStats';

const EmployeesLeaves = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Load leave requests from Firebase
  const loadLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const data = await getLeaveRequests();
      setLeaveRequests(data);
    } catch (error) {
      console.error("Error loading leave requests:", error);
      toast.error("Échec du chargement des demandes de congés");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    loadLeaveRequests();
  }, []);
  
  const handleRefresh = async () => {
    await loadLeaveRequests();
    toast.success("Données actualisées");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
      
      <LeaveStats leaveRequests={leaveRequests} />
      
      <div>
        <h3 className="text-lg font-medium mb-4">Demandes de congés</h3>
        <LeaveRequestsTable 
          leaveRequests={leaveRequests}
          isLoading={isLoading}
          onSuccess={handleRefresh}
        />
      </div>
      
      <CreateLeaveDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onLeaveCreated={handleRefresh}
      />
    </div>
  );
};

export default EmployeesLeaves;
