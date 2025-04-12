
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar,
  Filter,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLeaveData } from '@/hooks/useLeaveData';
import { CreateLeaveRequestDialog } from './CreateLeaveRequestDialog';
import LeaveRequestsList from './LeaveRequestsList';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { useHrModuleData } from '@/hooks/useHrModuleData';

const EmployeesLeaves: React.FC = () => {
  const { leaves, stats, isLoading, refetch } = useLeaveData();
  const { currentUser } = useHrModuleData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Rafraîchir les données au chargement du composant
  useEffect(() => {
    refetch();
  }, [refetch]);

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

  const handleApproveLeave = async (id: string) => {
    try {
      const leaveRef = doc(db, COLLECTIONS.HR.LEAVE_REQUESTS, id);
      await updateDoc(leaveRef, {
        status: 'Approuvé',
        approvedBy: currentUser?.displayName || 'Administrateur',
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Demande de congé approuvée');
      refetch();
    } catch (error) {
      console.error('Erreur lors de l\'approbation de la demande:', error);
      toast.error('Une erreur est survenue lors de l\'approbation');
    }
  };

  const handleRejectLeave = async (id: string) => {
    try {
      const leaveRef = doc(db, COLLECTIONS.HR.LEAVE_REQUESTS, id);
      await updateDoc(leaveRef, {
        status: 'Refusé',
        approvedBy: currentUser?.displayName || 'Administrateur',
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Demande de congé refusée');
      refetch();
    } catch (error) {
      console.error('Erreur lors du refus de la demande:', error);
      toast.error('Une erreur est survenue lors du refus');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Congés</h2>
          <p className="text-gray-500">Gestion des demandes de congés</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button size="sm" onClick={handleOpenCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">En attente</h3>
              <p className="text-2xl font-bold text-blue-700">
                {stats.pending}
              </p>
            </div>
            <div className="h-8 w-8 bg-blue-200 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Approuvés</h3>
              <p className="text-2xl font-bold text-green-700">
                {stats.approved}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-200 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-green-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-900">Refusés</h3>
              <p className="text-2xl font-bold text-red-700">
                {stats.rejected}
              </p>
            </div>
            <div className="h-8 w-8 bg-red-200 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-red-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total</h3>
              <p className="text-2xl font-bold text-gray-700">
                {stats.total}
              </p>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-gray-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <LeaveRequestsList 
            onApprove={handleApproveLeave}
            onReject={handleRejectLeave}
          />
        </CardContent>
      </Card>

      <CreateLeaveRequestDialog
        isOpen={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSubmit={handleCreateLeaveRequest}
      />
    </div>
  );
};

export default EmployeesLeaves;
