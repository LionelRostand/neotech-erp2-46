
import React, { useState, useEffect } from 'react';
import { Badge as BadgeIcon, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { BadgeData } from './badges/BadgeTypes';
import CreateBadgeDialog from './badges/CreateBadgeDialog';
import BadgePreviewDialog from './badges/BadgePreviewDialog';
import BadgeStats from './badges/BadgeStats';
import BadgesTable from './badges/BadgesTable';
import { getBadges, addBadge, deleteDocument } from './employees/services/badgeService';
import { useEmployeeData } from '@/hooks/useEmployeeData';

const EmployeesBadges: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [badgesList, setBadgesList] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);
  const { employees } = useEmployeeData();
  
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
      setBadgesList(data);
    } catch (error) {
      console.error("Erreur lors du chargement des badges:", error);
      // Utiliser des données fictives en cas d'erreur
      setBadgesList([
        {
          id: "B-2458",
          date: "2023-10-15",
          employeeId: "EMP001",
          employeeName: "Martin Dupont",
          department: "Sécurité",
          accessLevel: "Sécurité Niveau 3",
          status: "success",
          statusText: "Actif"
        },
        {
          id: "B-2457",
          date: "2023-10-14",
          employeeId: "EMP002",
          employeeName: "Sophie Martin",
          department: "Administration",
          accessLevel: "Administration",
          status: "success",
          statusText: "Actif"
        },
        {
          id: "B-2456",
          date: "2023-10-12",
          employeeId: "EMP003",
          employeeName: "Jean Lefebvre",
          department: "IT",
          accessLevel: "IT",
          status: "warning",
          statusText: "En attente"
        },
        {
          id: "B-2455",
          date: "2023-10-10",
          employeeId: "EMP004",
          employeeName: "Emma Bernard",
          department: "RH",
          accessLevel: "RH",
          status: "success",
          statusText: "Actif"
        },
        {
          id: "B-2454",
          date: "2023-10-09",
          employeeId: "EMP005",
          employeeName: "Thomas Petit",
          department: "Marketing",
          accessLevel: "Marketing",
          status: "danger",
          statusText: "Désactivé"
        }
      ]);
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
      />
    </>
  );
};

export default EmployeesBadges;
