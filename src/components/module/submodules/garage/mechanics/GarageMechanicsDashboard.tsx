
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useGarageMechanics } from '@/hooks/garage/useGarageMechanics';
import MechanicsStats from './components/MechanicsStats';
import { DataTable } from "@/components/ui/data-table";
import type { Column } from "@/types/table-types";
import type { Mechanic } from '@/components/module/submodules/garage/types/garage-types';

const GarageMechanicsDashboard = () => {
  const { mechanics = [], isLoading } = useGarageMechanics();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  
  const availableMechanics = mechanics.filter(m => m.status === 'available');
  const busyMechanics = mechanics.filter(m => m.status === 'in_service');
  const onBreakMechanics = mechanics.filter(m => m.status === 'on_break');

  const columns: Column[] = [
    { header: "Prénom", accessorKey: "firstName" },
    { header: "Nom", accessorKey: "lastName" },
    { header: "Email", accessorKey: "email" },
    { header: "Téléphone", accessorKey: "phone" },
    { header: "Spécialisation", 
      accessorFn: (row: Mechanic) => (row.specialization || []).join(', ') 
    },
    { header: "Statut", accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        return status === 'available' ? 'Disponible' :
               status === 'in_service' ? 'En service' :
               status === 'on_break' ? 'En pause' : status;
      }
    },
    { 
      header: "Actions",
      cell: () => (
        <Button variant="ghost" size="sm">
          Voir
        </Button>
      )
    }
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mécaniciens</h1>
        <Button onClick={() => setOpenAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau mécanicien
        </Button>
      </div>

      <MechanicsStats
        availableCount={availableMechanics.length}
        busyCount={busyMechanics.length}
        onBreakCount={onBreakMechanics.length}
        totalCount={mechanics.length}
      />

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Liste des mécaniciens</h2>
        </div>
        <DataTable 
          columns={columns}
          data={mechanics}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default GarageMechanicsDashboard;
