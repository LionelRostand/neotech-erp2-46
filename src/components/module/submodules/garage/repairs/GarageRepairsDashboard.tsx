import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Button } from "@/components/ui/button";
import { Plus, Wrench, Clock, PackageSearch, Settings } from 'lucide-react';
import { Card } from "@/components/ui/card";
import RepairsTable from './components/RepairsTable';
import AddRepairDialog from './AddRepairDialog';
import { format } from 'date-fns';

const GarageRepairsDashboard = () => {
  const { repairs, isLoading, refetch } = useGarageData();
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  const safeRepairs = Array.isArray(repairs) ? repairs : [];
  const today = format(new Date(), 'yyyy-MM-dd');

  const todaysRepairs = safeRepairs.filter(repair => {
    return repair.date && repair.date.startsWith(today);
  });

  const inProgress = safeRepairs.filter(repair => repair.status === 'in_progress');
  const awaitingParts = safeRepairs.filter(repair => repair.status === 'awaiting_parts');
  const allRepairs = safeRepairs.length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Réparations</h1>
        <Button onClick={() => setShowAddDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle réparation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 p-6">
          <div className="flex items-start gap-4">
            <Wrench className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{todaysRepairs.length}</p>
              <p className="text-sm text-gray-600">Réparations aujourd'hui</p>
              <p className="text-xs text-gray-500">Planifiées pour aujourd'hui</p>
            </div>
          </div>
        </Card>

        <Card className="bg-yellow-50 p-6">
          <div className="flex items-start gap-4">
            <Clock className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold">{inProgress.length}</p>
              <p className="text-sm text-gray-600">En cours</p>
              <p className="text-xs text-gray-500">Réparations actives</p>
            </div>
          </div>
        </Card>

        <Card className="bg-purple-50 p-6">
          <div className="flex items-start gap-4">
            <PackageSearch className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">{awaitingParts.length}</p>
              <p className="text-sm text-gray-600">En attente de pièces</p>
              <p className="text-xs text-gray-500">Commandes en attente</p>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 p-6">
          <div className="flex items-start gap-4">
            <Settings className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{allRepairs}</p>
              <p className="text-sm text-gray-600">Total réparations</p>
              <p className="text-xs text-gray-500">Toutes les réparations</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Liste de réparations</h2>
        </div>
        <div className="p-4">
          <RepairsTable 
            repairs={repairs}
            onRepairModified={refetch}
          />
        </div>
      </div>

      <AddRepairDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onRepairAdded={refetch}
      />
    </div>
  );
};

export default GarageRepairsDashboard;
