
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Car, Wrench, AlertTriangle } from "lucide-react";
import StatCard from '@/components/StatCard';
import AddVehicleDialog from './AddVehicleDialog';

const GarageVehiclesDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Véhicules</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau véhicule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Véhicules"
          value="48"
          icon={<Car className="h-5 w-5 text-blue-500" />}
          description="8 nouveaux ce mois"
        />
        <StatCard
          title="En Maintenance"
          value="12"
          icon={<Wrench className="h-5 w-5 text-amber-500" />}
          description="4 interventions urgentes"
        />
        <StatCard
          title="À Contrôler"
          value="6"
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          description="Contrôles planifiés"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Véhicules Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Liste à implémenter plus tard */}
              <p className="text-sm text-gray-500">Aucun véhicule récent</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Prévue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Liste à implémenter plus tard */}
              <p className="text-sm text-gray-500">Aucune maintenance prévue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddVehicleDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
};

export default GarageVehiclesDashboard;
