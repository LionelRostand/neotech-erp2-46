
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import AddVehicleDialog from './AddVehicleDialog';
import ViewVehicleDialog from './ViewVehicleDialog';
import EditVehicleDialog from './EditVehicleDialog';
import DeleteVehicleDialog from './DeleteVehicleDialog';
import { Vehicle } from '../types/garage-types';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

const GarageVehiclesDashboard = () => {
  const { vehicles, loading: isLoading, refetchVehicles } = useGarageVehicles();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Filtrer les véhicules en fonction de la recherche
  const filteredVehicles = vehicles.filter(vehicle => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (vehicle.brand && vehicle.brand.toLowerCase().includes(searchLower)) ||
      (vehicle.model && vehicle.model.toLowerCase().includes(searchLower)) ||
      (vehicle.licensePlate && vehicle.licensePlate.toLowerCase().includes(searchLower))
    );
  });

  // Formater l'état du véhicule pour l'affichage
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500 text-white">Disponible</Badge>;
      case 'in_service':
        return <Badge className="bg-blue-500 text-white">En service</Badge>;
      case 'maintenance':
        return <Badge className="bg-amber-500 text-white">En maintenance</Badge>;
      case 'out_of_service':
        return <Badge className="bg-red-500 text-white">Hors service</Badge>;
      default:
        return <Badge variant="outline">{status || 'Non défini'}</Badge>;
    }
  };

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowViewDialog(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditDialog(true);
  };

  const handleDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteDialog(true);
  };

  const getVehicleDisplayInfo = (vehicle: Vehicle) => {
    return `${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.licensePlate ? `(${vehicle.licensePlate})` : ''}`;
  };

  const columns = [
    {
      accessorKey: "brand",
      header: "Véhicule",
      cell: ({ row }: { row: { original: Vehicle } }) => {
        const vehicle = row.original;
        return (
          <div>
            <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
            {vehicle.year && <div className="text-sm text-muted-foreground">({vehicle.year})</div>}
          </div>
        );
      }
    },
    {
      accessorKey: "licensePlate",
      header: "Immatriculation",
    },
    {
      accessorKey: "mileage",
      header: "Kilométrage",
      cell: ({ row }: { row: { original: Vehicle } }) => (
        <span>{row.original.mileage ? `${row.original.mileage.toLocaleString()} km` : "Non renseigné"}</span>
      )
    },
    {
      accessorKey: "lastCheck",
      header: "Dernier contrôle",
      cell: ({ row }: { row: { original: Vehicle } }) => (
        <span>{row.original.lastCheck || "Non renseigné"}</span>
      )
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: { row: { original: Vehicle } }) => getStatusBadge(row.original.status)
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: Vehicle } }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleView(row.original)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des Véhicules</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un véhicule
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un véhicule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Véhicules</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={filteredVehicles} 
            isLoading={isLoading}
            emptyMessage="Aucun véhicule trouvé"
          />
        </CardContent>
      </Card>

      <AddVehicleDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={refetchVehicles}
      />

      {selectedVehicle && (
        <>
          <ViewVehicleDialog
            open={showViewDialog}
            onOpenChange={setShowViewDialog}
            vehicle={selectedVehicle}
          />

          <EditVehicleDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            vehicle={selectedVehicle}
            onSuccess={refetchVehicles}
          />

          <DeleteVehicleDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            vehicleId={selectedVehicle.id}
            vehicleInfo={getVehicleDisplayInfo(selectedVehicle)}
            onDeleted={refetchVehicles}
          />
        </>
      )}
    </div>
  );
};

export default GarageVehiclesDashboard;
