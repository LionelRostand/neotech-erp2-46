import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { Card } from "@/components/ui/card";
import AddVehicleDialog from './AddVehicleDialog';
import VehiclesStats from './components/VehiclesStats';
import ViewVehicleDialog from './components/ViewVehicleDialog';
import EditVehicleDialog from './components/EditVehicleDialog';
import DeleteVehicleDialog from './components/DeleteVehicleDialog';

const GarageVehiclesDashboard = () => {
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(null);
  const [showViewDialog, setShowViewDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const { vehicles = [], loading } = useGarageVehicles();
  
  const today = new Date().toISOString().split('T')[0];
  
  const newVehicles = vehicles.filter(v => {
    if (!v.createdAt) return false;
    
    try {
      const createdDate = new Date(v.createdAt);
      
      if (isNaN(createdDate.getTime())) return false;
      
      return createdDate.toISOString().split('T')[0] === today;
    } catch (error) {
      console.error("Error processing vehicle date:", v.createdAt, error);
      return false;
    }
  });
  
  const activeVehicles = vehicles.filter(v => v.status === 'active');
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance');

  if (loading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Véhicules</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau véhicule
        </Button>
      </div>

      <VehiclesStats
        todayCount={newVehicles.length}
        activeCount={activeVehicles.length}
        maintenanceCount={maintenanceVehicles.length}
        totalCount={vehicles.length}
      />

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Liste des véhicules</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Marque/Modèle</th>
                <th className="text-left p-2">Immatriculation</th>
                <th className="text-left p-2">Propriétaire</th>
                <th className="text-left p-2">Kilométrage</th>
                <th className="text-left p-2">Statut</th>
                <th className="text-left p-2">Dernier contrôle</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b">
                  <td className="p-2">{vehicle.make} {vehicle.model}</td>
                  <td className="p-2">{vehicle.licensePlate}</td>
                  <td className="p-2">{vehicle.clientId}</td>
                  <td className="p-2">{vehicle.mileage} km</td>
                  <td className="p-2">{vehicle.status}</td>
                  <td className="p-2">{vehicle.lastCheckDate || '-'}</td>
                  <td className="p-2 text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowViewDialog(true);
                      }}
                    >
                      Voir
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowEditDialog(true);
                      }}
                    >
                      Modifier
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowDeleteDialog(true);
                      }}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AddVehicleDialog 
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
        onVehicleAdded={() => {
          setShowAddDialog(false);
        }}
      />

      <ViewVehicleDialog
        vehicle={selectedVehicle}
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
      />

      <EditVehicleDialog
        vehicle={selectedVehicle}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={refetchVehicles}
      />

      <DeleteVehicleDialog
        vehicle={selectedVehicle}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={refetchVehicles}
      />
    </div>
  );
};

export default GarageVehiclesDashboard;
