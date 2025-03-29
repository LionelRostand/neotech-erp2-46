
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PlanningTabs from './PlanningTabs';
import AvailabilityCalendar from './AvailabilityCalendar';
import MaintenanceScheduleList from './MaintenanceScheduleList';
import ExtensionRequestsList from './ExtensionRequestsList';
import DriverAvailabilityTab from './DriverAvailabilityTab';
import { usePlanning } from './context/PlanningContext';

interface PlanningTabContentProps {
  activeMode: string;
  onModeChange: (mode: string) => void;
}

const PlanningTabContent: React.FC<PlanningTabContentProps> = ({
  activeMode,
  onModeChange
}) => {
  const [activeTab, setActiveTab] = useState("availability");
  
  // Use the planning context to access shared state
  const { 
    vehicles, 
    maintenanceSchedules, 
    extensionRequests,
    drivers,
    refreshData,
    openMaintenanceScheduleDialog,
    openExtensionDetailsDialog,
    handleAddMaintenance
  } = usePlanning();

  // Effect to refresh data when the component mounts
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <Tabs defaultValue="availability" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <PlanningTabs />
      
      <TabsContent value="availability" className="mt-0 border-0 p-0">
        <AvailabilityCalendar 
          vehicles={vehicles}
          maintenanceSchedules={maintenanceSchedules}
          onAddMaintenance={handleAddMaintenance}
        />
      </TabsContent>
      
      <TabsContent value="maintenance" className="mt-0 border-0 p-0">
        <MaintenanceScheduleList 
          maintenanceSchedules={maintenanceSchedules}
          vehicles={vehicles}
          onAddMaintenance={handleAddMaintenance}
        />
      </TabsContent>
      
      <TabsContent value="extensions" className="mt-0 border-0 p-0">
        <ExtensionRequestsList 
          extensionRequests={extensionRequests}
          onViewDetails={openExtensionDetailsDialog}
        />
      </TabsContent>
      
      <TabsContent value="drivers" className="mt-0 border-0 p-0">
        <DriverAvailabilityTab drivers={drivers} />
      </TabsContent>
    </Tabs>
  );
};

export default PlanningTabContent;
