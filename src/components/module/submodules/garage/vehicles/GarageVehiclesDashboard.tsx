
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Car, Settings, Tool, AlertTriangle } from "lucide-react";
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import VehiclesTable from './VehiclesTable';
import VehicleStatsCards from './VehicleStatsCards';
import AddVehicleDialog from './AddVehicleDialog';

const GarageVehiclesDashboard = () => {
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const { vehicles, isLoading, error } = useGarageVehicles();

  if (isLoading) {
    return <div className="p-8">Chargement des véhicules...</div>;
  }

  return (
    <div className="container p-6 mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des Véhicules</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un véhicule
        </Button>
      </div>

      <VehicleStatsCards vehicles={vehicles} />
      
      <Card className="p-6">
        <VehiclesTable vehicles={vehicles} />
      </Card>

      <AddVehicleDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageVehiclesDashboard;
