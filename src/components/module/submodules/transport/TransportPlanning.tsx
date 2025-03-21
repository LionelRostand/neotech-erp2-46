
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { PlanningProvider } from './planning/context/PlanningContext';
import { mockVehicles, mockMaintenanceSchedules, mockExtensionRequests, mockDrivers } from './planning/mockData';
import PlanningHeader from './planning/PlanningHeader';
import PlanningTabs from './planning/PlanningTabs';
import PlanningTabContent from './planning/PlanningTabContent';
import MaintenanceScheduleDialog from './planning/MaintenanceScheduleDialog';
import { usePlanning } from './planning/context/PlanningContext';

// Wrapper component to use the context
const PlanningContent = () => {
  const { maintenanceDialogOpen, setMaintenanceDialogOpen, selectedVehicle, handleSaveMaintenance, activeTab, setActiveTab } = usePlanning();

  return (
    <>
      <PlanningHeader />
      
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <PlanningTabs />
          <PlanningTabContent 
            mockVehicles={mockVehicles}
            mockMaintenanceSchedules={mockMaintenanceSchedules}
            mockExtensionRequests={mockExtensionRequests}
            mockDrivers={mockDrivers}
          />
        </Tabs>
      </Card>

      {/* Maintenance Schedule Dialog */}
      {maintenanceDialogOpen && (
        <MaintenanceScheduleDialog
          open={maintenanceDialogOpen}
          onOpenChange={setMaintenanceDialogOpen}
          vehicles={mockVehicles}
          selectedVehicle={selectedVehicle}
          onSave={handleSaveMaintenance}
        />
      )}
    </>
  );
};

const TransportPlanning = () => {
  return (
    <div className="space-y-6">
      <PlanningProvider>
        <PlanningContent />
      </PlanningProvider>
    </div>
  );
};

export default TransportPlanning;
