
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardHeaderProps {
  title: string;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold">{title}</h2>
      <div className="flex space-x-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[300px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="day">Jour</TabsTrigger>
            <TabsTrigger value="week">Semaine</TabsTrigger>
            <TabsTrigger value="month">Mois</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardHeader;
