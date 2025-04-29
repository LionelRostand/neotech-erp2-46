
import React, { useState, useEffect } from 'react';
import { Badge as BadgeIcon, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { BadgeData } from './employees/badges/BadgeTypes';
import CreateBadgeDialog from './badges/CreateBadgeDialog';
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

  // Load badges from Firebase
  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      setLoading(true);
      const data = await getBadges();
      setBadgesList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading badges:", error);
      toast.error("Failed to load badges");
      setBadgesList([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateBadge = async (newBadge: BadgeData) => {
    try {
      // Add badge to Firebase
      const addedBadge = await addBadge(newBadge);
      
      if (addedBadge) {
        // Update local state
        setBadgesList(prev => [addedBadge, ...(Array.isArray(prev) ? prev : [])]);
      } else {
        // In case of failure, add to local state anyway for smooth UX
        setBadgesList(prev => [newBadge, ...(Array.isArray(prev) ? prev : [])]);
      }
      
      // Show success notification
      toast.success(`Badge created successfully for employee: ${newBadge.employeeName}`);
    } catch (error) {
      console.error("Error creating badge:", error);
      toast.error("Failed to create badge");
      
      // Still update local state with optimistic UI
      setBadgesList(prev => [newBadge, ...(Array.isArray(prev) ? prev : [])]);
    }
  };
  
  const handleViewBadge = (badgeId: string) => {
    const badge = badgesList.find(b => b.id === badgeId);
    if (badge) {
      setSelectedBadge(badge);
      
      // Find the corresponding employee
      const safeEmployees = Array.isArray(employees) ? employees : [];
      const employee = safeEmployees.find(emp => emp.id === badge.employeeId) || 
                       safeEmployees.find(emp => `${emp.firstName} ${emp.lastName}` === badge.employeeName);
                       
      setSelectedBadgeEmployee(employee || null);
      setIsBadgePreviewOpen(true);
    }
  };

  const handleRefresh = async () => {
    await loadBadges();
    toast.success("Badge data refreshed");
  };
  
  // Handle badge deletion
  const handleDeleteBadge = async (badge: BadgeData) => {
    if (!badge || !badge.id) return;
    
    try {
      // Delete from Firebase
      await deleteDocument('HR.BADGES', badge.id);
      
      // Update local state
      setBadgesList(prev => prev.filter(b => b.id !== badge.id));
      
      // Close preview dialog
      setIsBadgePreviewOpen(false);
      
      toast.success("Badge deleted successfully");
    } catch (error) {
      console.error("Error deleting badge:", error);
      toast.error("Failed to delete badge");
    }
  };
  
  // Make sure employees is always an array
  const safeEmployees = Array.isArray(employees) ? employees : [];
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Badges and Access</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Badge
          </Button>
        </div>
      </div>
      
      <BadgeStats badgesList={badgesList || []} employeesCount={safeEmployees.length} />

      <BadgesTable 
        badgesList={badgesList || []} 
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
