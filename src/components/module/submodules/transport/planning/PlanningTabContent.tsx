
import React from 'react';
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import AvailabilityCalendar from './AvailabilityCalendar';
import MaintenanceScheduleList from './MaintenanceScheduleList';
import ExtensionRequestsList from './ExtensionRequestsList';
import DriverAvailabilityTab from './DriverAvailabilityTab';
import { usePlanning } from './context/PlanningContext';
import { TransportVehicle, MaintenanceSchedule, ExtensionRequest, TransportDriver } from '../types/transport-types';

interface PlanningTabContentProps {
  mockVehicles: TransportVehicle[];
  mockMaintenanceSchedules: MaintenanceSchedule[];
  mockExtensionRequests: ExtensionRequest[];
  mockDrivers: TransportDriver[];
}

const PlanningTabContent: React.FC<PlanningTabContentProps> = ({
  mockVehicles,
  mockMaintenanceSchedules,
  mockExtensionRequests,
  mockDrivers
}) => {
  const { activeTab, handleAddMaintenance, setMaintenanceDialogOpen } = usePlanning();

  return (
    <CardContent>
      <Tabs value={activeTab} className="w-full">
        <TabsContent value="availability" className="mt-0">
          <AvailabilityCalendar 
            vehicles={mockVehicles} 
            maintenanceSchedules={mockMaintenanceSchedules}
            onAddMaintenance={handleAddMaintenance}
          />
        </TabsContent>
        
        <TabsContent value="maintenance" className="mt-0">
          <MaintenanceScheduleList 
            maintenanceSchedules={mockMaintenanceSchedules}
            vehicles={mockVehicles}
            onAddMaintenance={() => setMaintenanceDialogOpen(true)}
          />
        </TabsContent>
        
        <TabsContent value="extensions" className="mt-0">
          <ExtensionRequestsList extensionRequests={mockExtensionRequests} />
        </TabsContent>
        
        <TabsContent value="drivers" className="mt-0">
          <DriverAvailabilityTab drivers={mockDrivers} />
        </TabsContent>
      </Tabs>
    </CardContent>
  );
};

export default PlanningTabContent;
