
import React, { useState } from 'react';
import { Badge as BadgeIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { employees } from '@/data/employees';
import { Employee } from '@/types/employee';
import { BadgeData } from './badges/BadgeTypes';
import CreateBadgeDialog from './badges/CreateBadgeDialog';
import BadgePreviewDialog from './badges/BadgePreviewDialog';
import BadgeStats from './badges/BadgeStats';
import BadgesTable from './badges/BadgesTable';

const EmployeesBadges: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [badgesList, setBadgesList] = useState<BadgeData[]>([
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
  
  const [isBadgePreviewOpen, setIsBadgePreviewOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  const [selectedBadgeEmployee, setSelectedBadgeEmployee] = useState<Employee | null>(null);
  
  const handleCreateBadge = (newBadge: BadgeData) => {
    // Add the new badge to the badges list
    setBadgesList(prev => [newBadge, ...prev]);
    
    // Show success toast
    toast.success(`Badge créé avec succès pour l'employé: ${newBadge.employeeName}`);
  };
  
  const handleViewBadge = (badgeId: string) => {
    const badge = badgesList.find(b => b.id === badgeId);
    if (badge) {
      setSelectedBadge(badge);
      
      // Find the corresponding employee
      const employee = employees.find(emp => emp.id === badge.employeeId) || 
                       employees.find(emp => `${emp.firstName} ${emp.lastName}` === badge.employeeName);
                       
      setSelectedBadgeEmployee(employee || null);
      setIsBadgePreviewOpen(true);
    }
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Badges et accès</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Créer un badge
        </Button>
      </div>
      
      <BadgeStats badgesList={badgesList} employeesCount={employees.length} />

      <BadgesTable badgesList={badgesList} onBadgeClick={handleViewBadge} />
      
      <CreateBadgeDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onBadgeCreated={handleCreateBadge} 
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
