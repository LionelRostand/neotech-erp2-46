
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportCard, ReportCardProps } from './ReportCard';
import { BarChart3 } from 'lucide-react';

interface ReportCategoryTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  reports: ReportCardProps[];
}

export const ReportCategoryTabs: React.FC<ReportCategoryTabsProps> = ({
  activeTab,
  setActiveTab,
  reports,
}) => {
  // Filter reports by active tab
  const filteredReports = activeTab === 'all' 
    ? reports 
    : reports.filter(report => report.category === activeTab);

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="all">Tous</TabsTrigger>
        <TabsTrigger value="rh">Général RH</TabsTrigger>
        <TabsTrigger value="absence">Absences</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="formation">Formation</TabsTrigger>
        <TabsTrigger value="paie">Paie</TabsTrigger>
        <TabsTrigger value="contrat">Contrats</TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report, index) => (
            <ReportCard key={index} {...report} />
          ))}
        </div>
        
        {filteredReports.length === 0 && (
          <div className="text-center py-10">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium">Aucun rapport disponible</h3>
            <p className="mt-1 text-gray-500">Aucun rapport n'est disponible pour cette catégorie.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
