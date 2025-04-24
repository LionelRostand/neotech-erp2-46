
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { CreateServiceDialog } from './CreateServiceDialog';
import { toast } from 'sonner';

const GarageServicesDashboard = () => {
  const { services = [], isLoading } = useGarageData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const handleCreate = async (data: any) => {
    try {
      toast.success('Service créé avec succès');
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la création du service');
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
      cell: ({ row }) => `${row.original.cost} €`
    },
    {
      accessorKey: "duration",
      header: "Durée",
      cell: ({ row }) => `${row.original.duration} min`
    }
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
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

      <Card>
        <CardHeader>
          <CardTitle>Liste des Services</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={services} 
          />
        </CardContent>
      </Card>

      <CreateServiceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default GarageServicesDashboard;
