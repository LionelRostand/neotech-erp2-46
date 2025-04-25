import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { RepairKanban } from './RepairKanban';
import { AddRepairDialog } from './AddRepairDialog';

const GarageRepairsDashboard = () => {
  const { repairs, isLoading } = useGarageData();
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  const inProgress = repairs.filter(r => r.status === 'in_progress');
  const awaitingParts = repairs.filter(r => r.status === 'awaiting_parts');
  const completed = repairs.filter(r => r.status === 'completed');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Réparations</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle réparation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Réparations"
          value={repairs.length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="En cours et terminées"
        />
        <StatCard
          title="En Cours"
          value={inProgress.length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Réparations actives"
        />
        <StatCard
          title="En Attente de Pièces"
          value={awaitingParts.length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Commandes en cours"
        />
        <StatCard
          title="Terminées"
          value={completed.length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Total complété"
        />
      </div>

      <RepairKanban />

      <AddRepairDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageRepairsDashboard;
