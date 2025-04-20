
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Car, Wrench, AlertTriangle } from "lucide-react";
import StatCard from '@/components/StatCard';
import { useGarageData } from '@/hooks/garage/useGarageData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AddVehicleDialog from './AddVehicleDialog';

const GarageVehiclesDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { vehicles, repairs, isLoading } = useGarageData();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  const stats = {
    total: vehicles.length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    needsCheck: vehicles.filter(v => {
      const lastCheck = new Date(v.lastCheckDate || '');
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return lastCheck < threeMonthsAgo;
    }).length
  };

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
          value={stats.total.toString()}
          icon={<Car className="h-5 w-5 text-blue-500" />}
          description="Parc automobile"
          className="bg-blue-50 hover:bg-blue-100"
        />
        <StatCard
          title="En Maintenance"
          value={stats.maintenance.toString()}
          icon={<Wrench className="h-5 w-5 text-amber-500" />}
          description="Véhicules en réparation"
          className="bg-amber-50 hover:bg-amber-100"
        />
        <StatCard
          title="À Contrôler"
          value={stats.needsCheck.toString()}
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          description="Contrôles à planifier"
          className="bg-red-50 hover:bg-red-100"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Véhicules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Immatriculation</TableHead>
                <TableHead>Kilométrage</TableHead>
                <TableHead>Dernier contrôle</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.mileage.toLocaleString()} km</TableCell>
                  <TableCell>
                    {vehicle.lastCheckDate 
                      ? new Date(vehicle.lastCheckDate).toLocaleDateString()
                      : 'Non renseigné'
                    }
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        vehicle.status === 'available' 
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : vehicle.status === 'maintenance'
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }
                    >
                      {vehicle.status === 'available' ? 'Disponible' 
                       : vehicle.status === 'maintenance' ? 'En maintenance'
                       : 'Indisponible'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddVehicleDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageVehiclesDashboard;
