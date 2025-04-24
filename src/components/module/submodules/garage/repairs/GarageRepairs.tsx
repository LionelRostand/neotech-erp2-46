
import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Plus, Shield } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { RepairKanban } from './RepairKanban';
import CreateRepairDialog from './CreateRepairDialog';
import useHasPermission from '@/hooks/useHasPermission';

const GarageRepairs = () => {
  const { repairs, isLoading, refetchRepairs } = useGarageData();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { hasPermission: hasViewPermission } = useHasPermission('garage-repairs', 'view');

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  // Handle case where user doesn't have permission
  if (!hasViewPermission) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-12">
          <div className="text-center">
            <Shield className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium">Accès limité</h3>
            <p className="text-sm text-gray-500 mt-2">
              Vous n'avez pas les permissions nécessaires pour visualiser les réparations.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const inProgress = repairs?.filter(r => r.status === 'in_progress') || [];
  const awaitingParts = repairs?.filter(r => r.status === 'awaiting_parts') || [];
  const completed = repairs?.filter(r => r.status === 'completed') || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Réparations</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle réparation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Réparations"
          value={(repairs?.length || 0).toString()}
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

      <CreateRepairDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          if (refetchRepairs) {
            refetchRepairs();
          }
        }}
      />
    </div>
  );
};

export default GarageRepairs;
