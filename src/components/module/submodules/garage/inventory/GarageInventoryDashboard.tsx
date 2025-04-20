
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { vehicleInventory } from './inventoryData';
import AddVehicleDialog from './AddVehicleDialog';

const GarageInventoryDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const columns = [
    {
      accessorKey: "licensePlate",
      header: "Immatriculation"
    },
    {
      accessorKey: "brand",
      header: "Marque"
    },
    {
      accessorKey: "model",
      header: "Modèle"
    },
    {
      accessorKey: "type",
      header: "Type"
    },
    {
      accessorKey: "owner",
      header: "Propriétaire",
      cell: ({ row }) => row.original.owner || "Garage (À vendre)"
    },
    {
      accessorKey: "condition",
      header: "État",
      cell: ({ row }) => (
        <div className={`px-2 py-1 rounded-full text-xs inline-block 
          ${row.original.condition === 'excellent' ? 'bg-green-100 text-green-800' : ''}
          ${row.original.condition === 'good' ? 'bg-blue-100 text-blue-800' : ''}
          ${row.original.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${row.original.condition === 'poor' ? 'bg-red-100 text-red-800' : ''}`}>
          {row.original.condition === 'excellent' ? 'Excellent' : ''}
          {row.original.condition === 'good' ? 'Bon' : ''}
          {row.original.condition === 'fair' ? 'Moyen' : ''}
          {row.original.condition === 'poor' ? 'Mauvais' : ''}
        </div>
      )
    },
    {
      accessorKey: "price",
      header: "Prix",
      cell: ({ row }) => row.original.price ? `${row.original.price.toLocaleString()} €` : 'N/A'
    }
  ];

  const clientVehicles = vehicleInventory.filter(v => v.owner);
  const forSaleVehicles = vehicleInventory.filter(v => !v.owner);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Inventaire du Parc Auto</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un véhicule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{vehicleInventory.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Véhicules Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{clientVehicles.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Véhicules à Vendre</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{forSaleVehicles.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Véhicules</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={vehicleInventory} />
        </CardContent>
      </Card>

      <AddVehicleDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageInventoryDashboard;
