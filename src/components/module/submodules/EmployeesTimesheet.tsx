
import React, { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import TimesheetTable from './timesheet/TimesheetTable';
import TimesheetStats from './timesheet/TimesheetStats';
import { useTimeSheetData } from '@/hooks/useTimeSheetData';

const EmployeesTimesheet = () => {
  const { timeSheets, isLoading, refetch } = useTimeSheetData();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('month');

  const handleRefresh = async () => {
    await refetch();
    toast.success("Données des feuilles de temps actualisées");
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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle feuille
          </Button>
        </div>
      </div>

      <TimesheetStats timesheetsList={timeSheets} />
      
      <TimesheetTable 
        data={timeSheets}
        isLoading={isLoading}
      />
    </>
  );
};

export default EmployeesTimesheet;
