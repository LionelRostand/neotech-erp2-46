
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { RepairsTable } from './RepairsTable';
import { RepairKanban } from './RepairKanban';
import CreateRepairDialog from './CreateRepairDialog';
import { useGarageRepairs } from '@/hooks/garage/useGarageRepairs';
import { toast } from 'sonner';

const GarageRepairs = () => {
  const { repairs, loading, error } = useGarageRepairs();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  console.log('GarageRepairs - repairs:', repairs);

  if (error) {
    toast.error(`Erreur: ${error.message}`);
    return <div className="container mx-auto p-6">
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600">Erreur de chargement</h3>
          <p className="text-sm text-gray-500 mt-2">{error.message}</p>
          <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </Card>
    </div>;
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
          toast.success("Réparation créée avec succès");
          window.location.reload(); // Force refresh to update data
        }}
      />
    </div>
  );
};

export default GarageRepairs;
