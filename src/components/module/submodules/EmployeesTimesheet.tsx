
import React, { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import TimesheetTable from './timesheet/TimesheetTable';
import TimesheetStats from './timesheet/TimesheetStats';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import CreateTimesheetDialog from './timesheet/CreateTimesheetDialog';
import { TimeReport } from '@/types/timesheet';

const EmployeesTimesheet = () => {
  // Use the Firebase collection hook with the correct path
  const { data: rawTimeSheets = [], isLoading, refetch } = useFirebaseCollection(
    COLLECTIONS.HR.TIMESHEET
  );
  
  // Ensure we have a valid array of timesheets
  const timeSheets = Array.isArray(rawTimeSheets) ? rawTimeSheets : [];
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Données des feuilles de temps actualisées");
    } catch (error) {
      console.error("Erreur lors de l'actualisation des feuilles de temps:", error);
      toast.error("Impossible d'actualiser les données des feuilles de temps");
    }
  };

  const handleCreateSuccess = () => {
    // Rafraîchir les données après création réussie
    handleRefresh();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Feuilles de temps</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle feuille
          </Button>
        </div>
      </div>

      <TimesheetStats timesheetsList={timeSheets} />
      
      <TimesheetTable 
        data={timeSheets}
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />

      <CreateTimesheetDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
};

export default EmployeesTimesheet;
