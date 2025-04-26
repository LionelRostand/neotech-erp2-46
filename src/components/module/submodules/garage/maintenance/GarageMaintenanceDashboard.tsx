
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Plus, FileEdit, Trash2, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AddMaintenanceDialog from "./AddMaintenanceDialog";
import EditMaintenanceDialog from "./EditMaintenanceDialog";
import DeleteMaintenanceDialog from "./DeleteMaintenanceDialog";
import ViewMaintenanceDialog from "./ViewMaintenanceDialog";
import { fr } from "date-fns/locale";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

const GarageMaintenanceDashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);

  const { data: maintenances = [], isLoading, error } = useQuery({
    queryKey: ['garage', 'maintenances'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, 'garage_maintenances'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, 'garage_vehicles'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  });

  const handleView = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setIsDeleteDialogOpen(true);
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find((v: any) => v.id === vehicleId);
    if (!vehicle) return "Véhicule inconnu";
    return `${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">En attente</span>;
      case 'in_progress':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">En cours</span>;
      case 'completed':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Terminée</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Annulée</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Erreur lors du chargement des données</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestion des Maintenances
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une maintenance
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenances</CardTitle>
          <CardDescription>
            Liste de toutes les opérations de maintenance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Coût</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Aucune maintenance enregistrée
                    </TableCell>
                  </TableRow>
                ) : (
                  maintenances.map((maintenance: any) => (
                    <TableRow key={maintenance.id}>
                      <TableCell>
                        {maintenance.date ? format(
                          new Date(maintenance.date),
                          'dd MMM yyyy',
                          { locale: fr }
                        ) : 'Date non spécifiée'}
                      </TableCell>
                      <TableCell>
                        {maintenance.vehicleId ? getVehicleInfo(maintenance.vehicleId) : 'Non spécifié'}
                      </TableCell>
                      <TableCell>{maintenance.description || 'Aucune description'}</TableCell>
                      <TableCell>{getStatusBadge(maintenance.status)}</TableCell>
                      <TableCell>{maintenance.totalCost !== undefined ? formatCurrency(maintenance.totalCost) : 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(maintenance)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(maintenance)}
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(maintenance)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddMaintenanceDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
      
      <ViewMaintenanceDialog 
        open={isViewDialogOpen} 
        onOpenChange={setIsViewDialogOpen}
        maintenance={selectedMaintenance}
      />
      
      <EditMaintenanceDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        maintenance={selectedMaintenance}
      />
      
      <DeleteMaintenanceDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
        maintenanceId={selectedMaintenance?.id}
      />
    </div>
  );
};

export default GarageMaintenanceDashboard;
