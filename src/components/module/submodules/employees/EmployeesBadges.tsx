import React, { useState, useEffect } from 'react';
import { Badge as BadgeIcon, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { BadgeData } from './badges/BadgeTypes';
import CreateBadgeDialog from './badges/CreateBadgeDialog';
import BadgePreviewDialog from './badges/BadgePreviewDialog';
import BadgeStats from './badges/BadgeStats';
import BadgesTable from '../badges/BadgesTable';
import ViewBadgeDialog from '../badges/ViewBadgeDialog';
import EditBadgeDialog from '../badges/EditBadgeDialog';
import DeleteBadgeDialog from '../badges/DeleteBadgeDialog';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { getBadges, addBadge, deleteBadge } from './services/badgeService';

const EmployeesBadges: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { employees } = useHrModuleData();
  
  // Use the Firebase collection hook to fetch badge data with the correct path
  const { data: badgesList, isLoading, refetch } = useFirebaseCollection<BadgeData>(
    COLLECTIONS.HR.BADGES
  );
  
  // États pour la prévisualisation, l'édition et la suppression des badges
  const [isBadgePreviewOpen, setIsBadgePreviewOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  const [selectedBadgeEmployee, setSelectedBadgeEmployee] = useState<Employee | null>(null);
  
  // Nouveaux états pour les dialogues
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [badgeToView, setBadgeToView] = useState<BadgeData | null>(null);
  const [badgeToEdit, setBadgeToEdit] = useState<BadgeData | null>(null);
  const [badgeToDelete, setBadgeToDelete] = useState<BadgeData | null>(null);

  const handleCreateBadge = async (newBadge: BadgeData) => {
    try {
      // This function would be implemented in badgeService.ts
      // For now we'll just update the UI optimistically
      toast.success(`Badge créé avec succès pour l'employé: ${newBadge.employeeName}`);
      refetch();
    } catch (error) {
      console.error("Erreur lors de la création du badge:", error);
      toast.error("Échec de la création du badge");
    }
  };
  
  const handleViewBadge = (badge: BadgeData) => {
    setBadgeToView(badge);
    setIsViewDialogOpen(true);
  };
  
  const handleEditBadge = (badge: BadgeData) => {
    setBadgeToEdit(badge);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteBadge = (badge: BadgeData) => {
    setBadgeToDelete(badge);
    setIsDeleteDialogOpen(true);
  };
  
  const handleBadgeUpdated = (updatedBadge: BadgeData) => {
    // Rafraîchir la liste des badges après mise à jour
    refetch();
  };
  
  const handleBadgeDeleted = (badgeId: string) => {
    // Rafraîchir la liste des badges après suppression
    refetch();
  };
  
  const handleBadgeClick = (badgeId: string) => {
    const badge = badgesList.find(b => b.id === badgeId);
    if (badge) {
      setSelectedBadge(badge);
      
      // Trouver l'employé correspondant
      const employee = employees.find(emp => emp.id === badge.employeeId) || 
                       employees.find(emp => `${emp.firstName} ${emp.lastName}` === badge.employeeName);
                       
      setSelectedBadgeEmployee(employee || null);
      setIsBadgePreviewOpen(true);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Données des badges actualisées");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Badges et accès</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Créer un badge
          </Button>
        </div>
      </div>
      
      <BadgeStats badgesList={badgesList} employeesCount={employees.length} />

      <BadgesTable 
        badgesList={badgesList} 
        onBadgeClick={handleBadgeClick} 
        loading={isLoading}
        onViewBadge={handleViewBadge}
        onEditBadge={handleEditBadge}
        onDeleteBadge={handleDeleteBadge}
      />
      
      <CreateBadgeDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onBadgeCreated={handleCreateBadge} 
        employees={employees}
      />
      
      <BadgePreviewDialog 
        isOpen={isBadgePreviewOpen} 
        onOpenChange={setIsBadgePreviewOpen} 
        selectedBadge={selectedBadge} 
        selectedEmployee={selectedBadgeEmployee} 
      />
      
      {/* Nouveaux dialogues pour voir, modifier et supprimer */}
      <ViewBadgeDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        badge={badgeToView}
      />
      
      <EditBadgeDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        badge={badgeToEdit}
        onBadgeUpdated={handleBadgeUpdated}
      />
      
      <DeleteBadgeDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        badge={badgeToDelete}
        onBadgeDeleted={handleBadgeDeleted}
      />
    </>
  );
};

export default EmployeesBadges;
