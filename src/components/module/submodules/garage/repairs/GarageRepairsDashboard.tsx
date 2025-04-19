
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import StatCard from '@/components/StatCard';
import { RepairKanban } from './RepairKanban';
import { repairs } from '../repairs/repairsData';
import CreateRepairDialog from './CreateRepairDialog';

const GarageRepairsDashboard = () => {
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  
  const stats = {
    inProgress: repairs.filter(r => r.status === 'in_progress').length,
    awaitingParts: repairs.filter(r => r.status === 'awaiting_parts').length,
    completed: repairs.filter(r => r.status === 'completed').length,
    total: repairs.length
  };

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
          value={stats.total.toString()}
          description="En cours et terminées"
        />
        <StatCard
          title="En cours"
          value={stats.inProgress.toString()}
          description="Réparations actives"
        />
        <StatCard
          title="En attente de pièces"
          value={stats.awaitingParts.toString()}
          description="Commandes en cours"
        />
        <StatCard
          title="Terminées"
          value={stats.completed.toString()}
          description="Ce mois-ci"
        />
      </div>

      <RepairKanban />

      <CreateRepairDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageRepairsDashboard;
