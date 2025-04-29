
import React, { useState, useEffect } from 'react';
import { Badge as BadgeIcon, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { BadgeData } from './employees/badges/BadgeTypes';
import CreateBadgeDialog from './employees/badges/CreateBadgeDialog';
import BadgePreviewDialog from './employees/badges/BadgePreviewDialog';
import BadgeStats from './employees/badges/BadgeStats';
import BadgesTable from './employees/badges/BadgesTable';
import { getBadges, addBadge, deleteDocument } from './employees/services/badgeService';
import { useHrModuleData } from '@/hooks/useHrModuleData';

const EmployeesBadges: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [badgesList, setBadgesList] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);
  const { employees = [] } = useHrModuleData();
  
  const [isBadgePreviewOpen, setIsBadgePreviewOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  const [selectedBadgeEmployee, setSelectedBadgeEmployee] = useState<Employee | null>(null);

  // Charger les badges depuis Firebase
  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      setLoading(true);
      const data = await getBadges();
      setBadgesList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur lors du chargement des badges:", error);
      toast.error("Échec du chargement des badges");
      setBadgesList([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateBadge = async (newBadge: BadgeData) => {
    try {
      // Ajout du badge à Firebase
      const addedBadge = await addBadge(newBadge);
      
      if (addedBadge) {
        // Mettre à jour l'état local
        setBadgesList(prev => [addedBadge, ...prev]);
      } else {
        // En cas d'échec, ajouter quand même à l'état local pour une expérience utilisateur fluide
        setBadgesList(prev => [newBadge, ...prev]);
      }
      
      // Afficher une notification de succès
      toast.success(`Badge créé avec succès pour l'employé: ${newBadge.employeeName}`);
    } catch (error) {
      console.error("Erreur lors de la création du badge:", error);
      toast.error("Échec de la création du badge");
      
      // Quand même mettre à jour l'état local en mode optimiste
      setBadgesList(prev => [newBadge, ...prev]);
    }
  };
  
  const handleViewBadge = (badgeId: string) => {
    const badge = badgesList.find(b => b.id === badgeId);
    if (badge) {
      setSelectedBadge(badge);
      
      // Trouver l'employé correspondant
      const safeEmployees = Array.isArray(employees) ? employees : [];
      const employee = safeEmployees.find(emp => emp.id === badge.employeeId) || 
                       safeEmployees.find(emp => `${emp.firstName} ${emp.lastName}` === badge.employeeName);
                       
      setSelectedBadgeEmployee(employee || null);
      setIsBadgePreviewOpen(true);
    }
  };

  const handleRefresh = async () => {
    await loadBadges();
    toast.success("Données des badges actualisées");
  };
  
  // Handle badge deletion
  const handleDeleteBadge = async (badge: BadgeData) => {
    if (!badge || !badge.id) return;
    
    try {
      // Delete from Firebase
      await deleteDocument(badge.id);
      
      // Update local state
      setBadgesList(prev => prev.filter(b => b.id !== badge.id));
      
      // Close preview dialog
      setIsBadgePreviewOpen(false);
      
      toast.success("Badge supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du badge:", error);
      toast.error("Échec de la suppression du badge");
    }
  };
  
  // Make sure employees is always an array
  const safeEmployees = Array.isArray(employees) ? employees : [];
  
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
      
      <BadgeStats badgesList={badgesList} employeesCount={safeEmployees.length} />

      <BadgesTable 
        badgesList={badgesList} 
        onBadgeClick={handleViewBadge} 
        loading={loading} 
      />
      
      <CreateBadgeDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onBadgeCreated={handleCreateBadge} 
        employees={safeEmployees}
      />
      
      <BadgePreviewDialog 
        isOpen={isBadgePreviewOpen} 
        onOpenChange={setIsBadgePreviewOpen} 
        selectedBadge={selectedBadge} 
        selectedEmployee={selectedBadgeEmployee}
        onDeleteClick={handleDeleteBadge}
      />
    </>
  );
};

export default EmployeesBadges;
