
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddMaintenanceDialog from './AddMaintenanceDialog';
import { useGarageData } from '@/hooks/garage/useGarageData';
import StatCard from '@/components/StatCard';
import { Car } from 'lucide-react';
import { Card } from "@/components/ui/card";
import MaintenanceTable from './components/MaintenanceTable';

const GarageMaintenanceDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { vehicles = [], isLoading } = useGarageData();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  const todayVehicles = vehicles.filter(v => {
    const today = new Date().toISOString().split('T')[0];
    return v.createdAt?.startsWith(today);
  }).length;

  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const inMaintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const totalVehicles = vehicles.length;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenances</h1>
        <Button onClick={() => setShowAddDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle maintenance
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Véhicules du jour"
          value={todayVehicles.toString()}
          description="Ajoutés aujourd'hui"
          icon={<Car className="h-4 w-4 text-blue-500" />}
          className="bg-blue-50"
        />
        <StatCard
          title="Véhicules actifs"
          value={activeVehicles.toString()}
          description="En bon état"
          icon={<Car className="h-4 w-4 text-emerald-500" />}
          className="bg-emerald-50"
        />
        <StatCard
          title="En maintenance"
          value={inMaintenanceVehicles.toString()}
          description="En réparation"
          icon={<Car className="h-4 w-4 text-amber-500" />}
          className="bg-amber-50"
        />
        <StatCard
          title="Total véhicules"
          value={totalVehicles.toString()}
          description="Dans la base de données"
          icon={<Car className="h-4 w-4 text-purple-500" />}
          className="bg-purple-50"
        />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Liste des véhicules</h2>
        <MaintenanceTable />
      </Card>

      <AddMaintenanceDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageMaintenanceDashboard;
