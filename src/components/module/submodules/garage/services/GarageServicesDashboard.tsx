import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { CreateServiceDialog } from './CreateServiceDialog';
import { ViewServiceDialog } from './ViewServiceDialog';
import { EditServiceDialog } from './EditServiceDialog';
import { DeleteServiceDialog } from './DeleteServiceDialog';
import { ServiceStats } from './ServiceStats';
import { updateDocument, deleteDocument } from '@/hooks/firestore/firestore-utils';
import { toast } from 'sonner';

const GarageServicesDashboard = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleCreate = async (data: any) => {
    try {
      toast.success('Service créé avec succès');
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la création du service');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await updateDocument('garage_services', selectedService.id, data);
      toast.success('Service mis à jour avec succès');
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du service');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDocument('garage_services', selectedService.id);
      toast.success('Service supprimé avec succès');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la suppression du service');
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Service",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "cost",
      header: "Coût",
      cell: ({ row }: { row: { original: any } }) => `${row.original.cost} €`
    },
    {
      accessorKey: "duration",
      header: "Durée",
      cell: ({ row }: { row: { original: any } }) => `${row.original.duration} min`
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setSelectedService(row.original);
              setIsViewDialogOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedService(row.original);
              setIsEditDialogOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedService(row.original);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement des services...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des Services</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Service
        </Button>
      </div>

      <ServiceStats />

      <Card>
        <CardHeader>
          <CardTitle>Liste des Services</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={services || []} 
            isLoading={isLoading}
            emptyMessage="Aucun service disponible"
          />
        </CardContent>
      </Card>

      <CreateServiceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreate}
      />

      <ViewServiceDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        service={selectedService}
      />

      <EditServiceDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        service={selectedService}
        onSubmit={handleUpdate}
      />

      <DeleteServiceDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default GarageServicesDashboard;
