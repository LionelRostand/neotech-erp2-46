
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimeReportTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TimeReportTabs: React.FC<TimeReportTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
        <TabsList className="grid w-full sm:w-auto grid-cols-2 h-10">
          <TabsTrigger value="reports" className="px-4 py-2">
            Mes rapports
          </TabsTrigger>
          <TabsTrigger value="new" className="px-4 py-2">
            Nouveau rapport
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TimeReportTabs;
