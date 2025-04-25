
import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { AddRepairDialog } from './AddRepairDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import RepairsStats from './components/RepairsStats';
import RepairsTable from './components/RepairsTable';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GarageRepairsDashboard = () => {
  const { repairs, isLoading } = useGarageData();
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  // Calculer les statistiques
  const today = new Date();
  const todaysRepairs = repairs.filter(r => {
    const repairDate = new Date(r.date || r.startDate);
    return repairDate.toDateString() === today.toDateString();
  });

  const inProgress = repairs.filter(r => r.status === 'in_progress');
  const awaitingParts = repairs.filter(r => r.status === 'awaiting_parts');
  const allRepairs = repairs.length;

  // Trier les réparations par date pour avoir les plus récentes
  const sortedRepairs = [...repairs].sort((a, b) => {
    const dateA = new Date(a.date || a.startDate || Date.now());
    const dateB = new Date(b.date || b.startDate || Date.now());
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button onClick={() => setShowAddDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau service
        </Button>
      </div>

      <RepairsStats 
        todayCount={todaysRepairs.length}
        activeCount={inProgress.length}
        pendingPartsCount={awaitingParts.length}
        totalCount={allRepairs}
      />

      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Derniers services</h2>
        </div>
        <div className="p-4">
          <RepairsTable repairs={sortedRepairs.map(repair => ({
            ...repair,
            date: repair.date || repair.startDate,
            vehicleInfo: repair.vehicleName || repair.vehicleId
          }))} />
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
