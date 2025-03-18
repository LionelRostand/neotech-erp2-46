
import React, { useState } from 'react';
import TimeReportTabs from './timesheet/TimeReportTabs';
import EmptyTimeReports from './timesheet/EmptyTimeReports';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TimeReport } from '@/types/timesheet';

const EmployeesTimesheet: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState<TimeReport[]>([]);

  const handleNewReport = () => {
    // This would typically open a form or dialog for creating a new report
    console.log('Create new time report');
    setActiveTab('new');
  };

  return (
    <div>
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <TimeReportTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Rapports d'activité</h2>
        <Button 
          onClick={handleNewReport} 
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus size={20} />
          Nouveau rapport
        </Button>
      </div>

      {reports.length === 0 && (
        <EmptyTimeReports />
      )}
    </div>
  );
};

export default EmployeesTimesheet;
