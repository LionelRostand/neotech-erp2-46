
import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Button } from "@/components/ui/button";
import { Wrench, Clock, Package, Cog, Plus } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddRepairDialog } from './AddRepairDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const GarageRepairsDashboard = () => {
  const { repairs, isLoading } = useGarageData();
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  // Calculer les statistiques
  const today = new Date();
  const todaysRepairs = repairs.filter(r => {
    const repairDate = new Date(r.date);
    return repairDate.toDateString() === today.toDateString();
  });

  const inProgress = repairs.filter(r => r.status === 'in_progress');
  const awaitingParts = repairs.filter(r => r.status === 'awaiting_parts');
  const allRepairs = repairs.length;

  // Trier les réparations par date pour avoir les plus récentes
  const sortedRepairs = [...repairs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button onClick={() => setShowAddDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Réparations aujourd'hui"
          value={todaysRepairs.length.toString()}
          icon={<Wrench className="h-8 w-8 text-blue-500" />}
          description="Planifiées pour aujourd'hui"
        />
        <StatCard
          title="En cours"
          value={inProgress.length.toString()}
          icon={<Clock className="h-8 w-8 text-amber-500" />}
          description="Réparations actives"
        />
        <StatCard
          title="En attente de pièces"
          value={awaitingParts.length.toString()}
          icon={<Package className="h-8 w-8 text-purple-500" />}
          description="Commandes en attente"
        />
        <StatCard
          title="Total réparations"
          value={allRepairs.toString()}
          icon={<Cog className="h-8 w-8 text-emerald-500" />}
          description="Toutes les réparations"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Derniers services</h2>
        </div>
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Mécanicien</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRepairs.map((repair) => (
                <TableRow key={repair.id}>
                  <TableCell>
                    {format(new Date(repair.date), 'yyyy-MM-dd', { locale: fr })}
                  </TableCell>
                  <TableCell>{repair.clientName}</TableCell>
                  <TableCell>{repair.vehicleName}</TableCell>
                  <TableCell>{repair.description}</TableCell>
                  <TableCell>{repair.mechanicName}</TableCell>
                  <TableCell>{repair.status}</TableCell>
                  <TableCell>{repair.progress}%</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm">
                      <span className="sr-only">Voir</span>
                      👁️
                    </Button>
                    <Button variant="ghost" size="sm">
                      <span className="sr-only">Modifier</span>
                      ✏️
                    </Button>
                    <Button variant="ghost" size="sm">
                      <span className="sr-only">Supprimer</span>
                      🗑️
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddRepairDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageRepairsDashboard;
