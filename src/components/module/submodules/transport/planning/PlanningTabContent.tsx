
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PlanningTabs from './PlanningTabs';
import AvailabilityCalendar from './AvailabilityCalendar';
import MaintenanceScheduleList from './MaintenanceScheduleList';
import ExtensionRequestsList from './ExtensionRequestsList';
import DriverAvailabilityTab from './DriverAvailabilityTab';
import { usePlanning } from './context/PlanningContext';
import { TransportVehicle, MaintenanceSchedule } from '../types';

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
    openExtensionDetailsDialog
  } = usePlanning();

  // Convert maintenance schedules to properly formatted objects with required technician
  const formattedSchedules = maintenanceSchedules.map(schedule => ({
    ...schedule,
    technicianAssigned: typeof schedule.technicianAssigned === 'boolean' 
      ? (schedule.technicianAssigned ? 'Yes' : 'No')
      : (schedule.technicianAssigned || schedule.technician || 'Unassigned')
  }));

  // Adapter functions to match expected signatures
  const handleAddMaintenance = (vehicle: TransportVehicle) => {
    openMaintenanceScheduleDialog(vehicle);
  };

  // Adapter for openExtensionDetailsDialog
  const handleViewExtensionDetails = (requestId: string) => {
    // Find the request by ID first
    const request = extensionRequests.find(req => req.id === requestId);
    if (request) {
      openExtensionDetailsDialog(request);
    }
  };

  // Effect to refresh data when the component mounts
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Function to convert maintenanceSchedules with proper typing for the AvailabilityCalendar
  // Ensure notes property is always provided and in the right format (string)
  const getFormattedMaintenanceSchedules = () => {
    return maintenanceSchedules.map(schedule => ({
      ...schedule,
      technicianAssigned: typeof schedule.technicianAssigned === 'boolean' 
        ? (schedule.technicianAssigned ? 'Yes' : 'No')
        : (schedule.technicianAssigned || schedule.technician || 'Unassigned'),
      // Convert notes to string if it's an array, otherwise use the provided string or empty string
      notes: Array.isArray(schedule.notes) 
        ? schedule.notes.join(', ') // Convert array to string by joining
        : (schedule.notes || '') // Use existing string or empty string
    }));
  };

  return (
    <Tabs defaultValue="availability" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <PlanningTabs />
      
      <TabsContent value="availability" className="mt-0 border-0 p-0">
        <AvailabilityCalendar 
          vehicles={vehicles}
          maintenanceSchedules={getFormattedMaintenanceSchedules()}
          onAddMaintenance={handleAddMaintenance}
        />
      </TabsContent>
      
      <TabsContent value="maintenance" className="mt-0 border-0 p-0">
        <MaintenanceScheduleList 
          maintenanceSchedules={getFormattedMaintenanceSchedules()}
          vehicles={vehicles}
          onAddMaintenance={handleAddMaintenance}
        />
      </TabsContent>
      
      <TabsContent value="extensions" className="mt-0 border-0 p-0">
        <ExtensionRequestsList 
          extensionRequests={extensionRequests}
          onViewDetails={handleViewExtensionDetails}
        />
      </TabsContent>
      
      <TabsContent value="drivers" className="mt-0 border-0 p-0">
        <DriverAvailabilityTab drivers={drivers} />
      </TabsContent>
    </Tabs>
  );
};

export default PlanningTabContent;
