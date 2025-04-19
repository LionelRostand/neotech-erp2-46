
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";
import StatCard from '@/components/StatCard';
import { RepairKanban } from './RepairKanban';
import { repairs, clientsMap, vehiclesMap, mechanicsMap } from './repairsData';
import CreateRepairDialog from './CreateRepairDialog';
import { Repair } from '../types/garage-types';
import { toast } from 'sonner';

const GarageRepairsDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [repairsData, setRepairsData] = useState<Repair[]>(repairs);
  
  const stats = {
    inProgress: repairsData.filter(r => r.status === 'in_progress').length,
    awaitingParts: repairsData.filter(r => r.status === 'awaiting_parts').length,
    completed: repairsData.filter(r => r.status === 'completed').length,
    total: repairsData.length
  };

  const handleSaveRepair = (repair: any) => {
    const newRepair: Repair = {
      ...repair,
      id: `REP${Date.now().toString().substring(8)}`,
      progress: 0,
    };
    
    setRepairsData([...repairsData, newRepair]);
    toast.success('Réparation créée avec succès');
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
          icon={<Wrench className="h-4 w-4" />}
        />
        <StatCard
          title="En cours"
          value={stats.inProgress.toString()}
          description="Réparations actives"
          icon={<Wrench className="h-4 w-4" />}
        />
        <StatCard
          title="En attente de pièces"
          value={stats.awaitingParts.toString()}
          description="Commandes en cours"
          icon={<Wrench className="h-4 w-4" />}
        />
        <StatCard
          title="Terminées"
          value={stats.completed.toString()}
          description="Ce mois-ci"
          icon={<Wrench className="h-4 w-4" />}
        />
      </div>

      <RepairKanban repairs={repairsData} setRepairs={setRepairsData} />

      <CreateRepairDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSave={handleSaveRepair}
        clientsMap={clientsMap}
        vehiclesMap={vehiclesMap}
        mechanicsMap={mechanicsMap}
      />
    </div>
  );
};

export default GarageRepairsDashboard;
