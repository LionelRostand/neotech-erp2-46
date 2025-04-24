
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wrench, Shield } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { RepairKanban } from './RepairKanban';
import { RepairsTable } from './RepairsTable';
import CreateRepairDialog from './CreateRepairDialog';
import useHasPermission from '@/hooks/useHasPermission';
import { useGarageRepairs } from '@/hooks/garage/useGarageRepairs';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const GarageRepairs = () => {
  const { repairs, loading, error } = useGarageRepairs();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { hasPermission: hasViewPermission } = useHasPermission('garage-repairs', 'view');
  const queryClient = useQueryClient();

  // Ajouter des logs pour déboguer
  console.log('GarageRepairs - repairs:', repairs);
  console.log('GarageRepairs - loading:', loading);
  console.log('GarageRepairs - error:', error);

  if (loading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  if (error) {
    toast.error(`Erreur de chargement: ${error.message}`);
    console.error("Erreur lors du chargement des réparations:", error);
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

  // Filtrer les réparations pour les statistiques
  const todayRepairs = repairs.filter(r => {
    const today = new Date().toISOString().split('T')[0];
    return r.startDate === today;
  });

  const inProgressRepairs = repairs.filter(r => r.status === 'in_progress');
  const awaitingPartsRepairs = repairs.filter(r => r.status === 'awaiting_parts');

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
          title="Réparations aujourd'hui"
          value={todayRepairs.length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Planifiées pour aujourd'hui"
        />
        <StatCard
          title="En Cours"
          value={inProgressRepairs.length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Réparations actives"
        />
        <StatCard
          title="En Attente de Pièces"
          value={awaitingPartsRepairs.length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Commandes en cours"
        />
        <StatCard
          title="Total"
          value={repairs.length.toString()}
          icon={<Wrench className="h-4 w-4" />}
          description="Toutes les réparations"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dernières réparations</CardTitle>
        </CardHeader>
        <CardContent>
          <RepairsTable />
        </CardContent>
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
