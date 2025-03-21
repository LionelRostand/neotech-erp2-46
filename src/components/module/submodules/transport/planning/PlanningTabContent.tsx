
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, TruckIcon, Users } from "lucide-react";
import AvailabilityCalendar from './AvailabilityCalendar';
import MaintenanceScheduleList from './MaintenanceScheduleList';
import ExtensionRequestsList from './ExtensionRequestsList';
import { usePlanningContext } from './context/PlanningContext';

interface PlanningTabContentProps {
  activeMode: string;
  onModeChange: (mode: string) => void;
}

const PlanningTabContent: React.FC<PlanningTabContentProps> = ({
  activeMode,
  onModeChange
}) => {
  const { 
    vehicles,
    maintenanceSchedules, 
    extensionRequests,
    handleAddMaintenance
  } = usePlanningContext();

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
        <MaintenanceScheduleList 
          maintenanceSchedules={maintenanceSchedules}
          vehicles={vehicles}
          onAddMaintenance={handleAddMaintenance}
        />
      </TabsContent>
      
      <TabsContent value="calendar">
        <AvailabilityCalendar 
          vehicles={vehicles}
          maintenanceSchedules={maintenanceSchedules}
          onAddMaintenance={handleAddMaintenance}
        />
      </TabsContent>
      
      <TabsContent value="extensions">
        <ExtensionRequestsList 
          extensionRequests={extensionRequests}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PlanningTabContent;
