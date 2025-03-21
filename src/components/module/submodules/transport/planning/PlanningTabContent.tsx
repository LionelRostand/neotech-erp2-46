
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, TruckIcon, Users } from "lucide-react";
import AvailabilityCalendar from './AvailabilityCalendar';
import MaintenanceScheduleList from './MaintenanceScheduleList';
import ExtensionRequestsList from './ExtensionRequestsList';

interface PlanningTabContentProps {
  activeMode: string;
  onModeChange: (mode: string) => void;
}

const PlanningTabContent: React.FC<PlanningTabContentProps> = ({
  activeMode,
  onModeChange
}) => {
  return (
    <Tabs value={activeMode} onValueChange={onModeChange} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="vehicles" className="flex items-center gap-2">
          <TruckIcon className="h-4 w-4" />
          <span>Véhicules</span>
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Calendrier</span>
        </TabsTrigger>
        <TabsTrigger value="extensions" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Extensions</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="vehicles">
        <MaintenanceScheduleList />
      </TabsContent>
      
      <TabsContent value="calendar">
        <AvailabilityCalendar />
      </TabsContent>
      
      <TabsContent value="extensions">
        <ExtensionRequestsList />
      </TabsContent>
    </Tabs>
  );
};

export default PlanningTabContent;
