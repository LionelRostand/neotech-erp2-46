import React, { useState, useEffect } from 'react';
import { Badge as BadgeIcon, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { BadgeData } from './badges/BadgeTypes';
import CreateBadgeDialog from './badges/CreateBadgeDialog';
import BadgePreviewDialog from './badges/BadgePreviewDialog';
import DeleteBadgeDialog from './badges/DeleteBadgeDialog';
import BadgeStats from './badges/BadgeStats';
import BadgesTable from './badges/BadgesTable';
import { getBadges, addBadge, deleteDocument } from './services/badgeService';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { usePermissions } from '@/hooks/usePermissions';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';

const EmployeesBadges: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [badgesList, setBadgesList] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);
  const { employees } = useHrModuleData();
  const { isAdmin } = usePermissions('employees-badges');
  const { departments } = useAvailableDepartments();
  
  const [isBadgePreviewOpen, setIsBadgePreviewOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  const [selectedBadgeEmployee, setSelectedBadgeEmployee] = useState<Employee | null>(null);
  
  // États pour la suppression
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      setLoading(true);
      const data = await getBadges();
      setBadgesList(data);
    } catch (error) {
      console.error("Erreur lors du chargement des badges:", error);
      toast.error("Échec du chargement des badges");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBadge = async (newBadge: BadgeData) => {
    try {
      console.log("Création d'un nouveau badge:", newBadge);
      const departmentName = departments.find(dept => dept.id === newBadge.department)?.name || newBadge.department;
      const badgeToCreate = {
        ...newBadge,
        department: departmentName
      };
      
      const addedBadge = await addBadge(badgeToCreate);
      
      if (addedBadge) {
        setBadgesList(prev => [addedBadge, ...prev]);
        toast.success(`Badge créé avec succès pour l'employé: ${newBadge.employeeName}`);
      } else {
        setBadgesList(prev => [badgeToCreate, ...prev]);
        toast.error("Problème lors de la création du badge dans la base de données");
      }
    } catch (error) {
      console.error("Erreur lors de la création du badge:", error);
      toast.error("Échec de la création du badge");
      
      setBadgesList(prev => [newBadge, ...prev]);
    }
  };

  const handleViewBadge = (badgeId: string) => {
    const badge = badgesList.find(b => b.id === badgeId);
    if (badge) {
      setSelectedBadge(badge);
      
      const employee = employees.find(emp => emp.id === badge.employeeId) || 
                       employees.find(emp => `${emp.firstName} ${emp.lastName}` === badge.employeeName);
                       
      setSelectedBadgeEmployee(employee || null);
      setIsBadgePreviewOpen(true);
    }
  };

  const handleRefresh = async () => {
    await loadBadges();
    toast.success("Données des badges actualisées");
  };

  const handleDeleteClick = (badge: BadgeData) => {
    setSelectedBadge(badge);
    setIsBadgePreviewOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBadge) return;
    
    try {
      setIsDeleting(true);
      await deleteDocument(COLLECTIONS.HR.BADGES, selectedBadge.id);
      
      setBadgesList(prev => prev.filter(badge => badge.id !== selectedBadge.id));
      
      setIsDeleteDialogOpen(false);
      toast.success("Badge supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du badge:", error);
      toast.error("Échec de la suppression du badge");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Badges et accès</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
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
        onBadgeClick={handleViewBadge} 
        loading={loading} 
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
        onDeleteClick={handleDeleteClick}
      />
      
      <DeleteBadgeDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        badge={selectedBadge}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default EmployeesBadges;
