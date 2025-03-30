
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TransportVehicle, MaintenanceSchedule } from '../types';
import MaintenanceTable from './MaintenanceTable';

interface MaintenanceScheduleListProps {
  maintenanceSchedules: MaintenanceSchedule[];
  vehicles: TransportVehicle[];
  onAddMaintenance: (vehicle: TransportVehicle | null) => void;
}

const MaintenanceScheduleList: React.FC<MaintenanceScheduleListProps> = ({
  maintenanceSchedules,
  vehicles,
  onAddMaintenance
}) => {
  const handleAddMaintenance = () => {
    onAddMaintenance(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle>Programme de Maintenance</CardTitle>
          <Button 
            size="sm"
            className="flex items-center gap-2"
            onClick={handleAddMaintenance}
          >
            <Plus size={16} />
            <span>Planifier une maintenance</span>
          </Button>
        </CardHeader>
        <CardContent>
          <MaintenanceTable 
            maintenanceSchedules={maintenanceSchedules}
            vehicles={vehicles}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceScheduleList;
