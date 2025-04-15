
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useReportsData } from '@/hooks/useReportsData';
import { ReportFilters } from './reports/ReportFilters';
import { ReportCategoryTabs } from './reports/ReportCategoryTabs';
import { ReportCardProps } from './reports/ReportCard';
import { getMockReports } from './reports/reportsData';
import { PieChart, FileText, Users, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/formatters';

const EmployeesReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const { reports, stats, isLoading } = useReportsData();
  
  // Combine real reports with mock reports for demonstration
  const combinedReports: ReportCardProps[] = [
    ...getMockReports(),
    ...reports.map(report => ({
      title: report.title,
      description: report.description || 'Rapport généré automatiquement',
      lastUpdated: report.createdDate,
      icon: React.createElement(getReportIcon(report.type), { className: "h-5 w-5 text-blue-500" }),
      status: report.status === 'Généré' ? 'ready' : 
              report.status === 'En traitement' ? 'updating' : 'scheduled',
      category: getCategoryFromType(report.type)
    }))
  ];
  
  // Helper function to get icon based on report type
  function getReportIcon(type: string) {
    switch (type.toLowerCase()) {
      case 'effectifs':
      case 'personnel':
        return Users;
      case 'absences':
      case 'congés':
        return Calendar;
      case 'statistiques':
        return PieChart;
      default:
        return FileText;
    }
  }
  
  // Helper function to map report type to category
  function getCategoryFromType(type: string): string {
    switch (type.toLowerCase()) {
      case 'effectifs':
      case 'personnel':
        return 'rh';
      case 'absences':
      case 'congés':
        return 'absence';
      case 'performance':
        return 'performance';
      case 'formation':
        return 'formation';
      case 'salaire':
      case 'paie':
        return 'paie';
      case 'contrat':
        return 'contrat';
      default:
        return 'rh';
    }
  }
  
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          <ReportFilters 
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
          />
          
          <ReportCategoryTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            reports={combinedReports}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeesReports;
