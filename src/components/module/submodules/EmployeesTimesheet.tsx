
import React, { useState } from 'react';
import TimeReportTabs from './timesheet/TimeReportTabs';
import EmptyTimeReports from './timesheet/EmptyTimeReports';
import TimeReportsTable from './timesheet/TimeReportsTable';
import TimeReportForm from './timesheet/TimeReportForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TimeReport } from '@/types/timesheet';
import { toast } from 'sonner';

const EmployeesTimesheet: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reports');
  // Mock data for time reports
  const [reports, setReports] = useState<TimeReport[]>([
    {
      id: '1',
      title: 'Rapport hebdomadaire',
      employeeName: 'Jean Dupont',
      startDate: '2025-03-10',
      endDate: '2025-03-16',
      totalHours: 38,
      status: 'Validé',
      lastUpdated: '2025-03-18'
    },
    {
      id: '2',
      title: 'Rapport projet marketing',
      employeeName: 'Marie Laurent',
      startDate: '2025-03-01',
      endDate: '2025-03-15',
      totalHours: 42,
      status: 'Soumis',
      lastUpdated: '2025-03-16'
    },
    {
      id: '3',
      title: 'Rapport mensuel',
      employeeName: 'Thomas Martin',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      totalHours: 160,
      status: 'En cours',
      lastUpdated: '2025-03-15'
    },
    {
      id: '4',
      title: 'Formation technique',
      employeeName: 'Sophie Petit',
      startDate: '2025-03-05',
      endDate: '2025-03-07',
      totalHours: 24,
      status: 'Rejeté',
      lastUpdated: '2025-03-12'
    }
  ]);

  const handleNewReport = () => {
    console.log('Create new time report');
    setActiveTab('new');
  };

  const handleSubmitReport = (reportData: Omit<TimeReport, 'id' | 'lastUpdated'>) => {
    // Generate a unique ID and add current date as lastUpdated
    const newReport: TimeReport = {
      ...reportData,
      id: (reports.length + 1).toString(),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setReports([newReport, ...reports]);
    setActiveTab('reports');
    toast.success('Rapport d\'activité créé avec succès !');
  };

  const handleCancelReport = () => {
    setActiveTab('reports');
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

      {activeTab === 'reports' && (
        <>
          {reports.length === 0 ? (
            <EmptyTimeReports />
          ) : (
            <TimeReportsTable reports={reports} />
          )}
        </>
      )}

      {activeTab === 'new' && (
        <TimeReportForm onSubmit={handleSubmitReport} onCancel={handleCancelReport} />
      )}
    </div>
  );
};

export default EmployeesTimesheet;
