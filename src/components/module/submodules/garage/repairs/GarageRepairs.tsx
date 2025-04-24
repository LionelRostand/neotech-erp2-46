import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { RepairKanban } from './RepairKanban';
import { RepairsTable } from './RepairsTable';
import CreateRepairDialog from './CreateRepairDialog';
import useHasPermission from '@/hooks/useHasPermission';
import { useGarageRepairs } from '@/hooks/garage/useGarageRepairs';
import { useQueryClient } from '@tanstack/react-query';

const GarageRepairs = () => {
  const { repairs, loading } = useGarageRepairs();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { hasPermission: hasViewPermission } = useHasPermission('garage-repairs', 'view');
  const queryClient = useQueryClient();

  if (loading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

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
          value={repairs?.filter(r => r.status === 'in_progress').length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Réparations actives"
        />
        <StatCard
          title="En Attente de Pièces"
          value={repairs?.filter(r => r.status === 'awaiting_parts').length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Commandes en cours"
        />
        <StatCard
          title="Terminées"
          value={repairs?.filter(r => r.status === 'completed').length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Total complété"
        />
      </div>

      <Card className="p-6">
        <RepairsTable />
      </Card>

      <RepairKanban />

      <CreateRepairDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          queryClient.invalidateQueries(['garage', 'repairs']);
        }}
      />
    </div>
  );
};

export default GarageRepairs;
