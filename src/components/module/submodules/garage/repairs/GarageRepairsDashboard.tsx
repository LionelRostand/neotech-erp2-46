
import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Button } from "@/components/ui/button";
import { Plus, Wrench, Clock, PackageSearch, Settings, Eye, Pencil, Trash2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import AddRepairDialog from './AddRepairDialog';

const GarageRepairsDashboard = () => {
  const { repairs, isLoading } = useGarageData();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const today = new Date();
  const todaysRepairs = repairs.filter(r => {
    if (!r.date && !r.startDate) return false;
    const repairDate = new Date(r.date || r.startDate);
    return !isNaN(repairDate.getTime()) && repairDate.toDateString() === today.toDateString();
  });

  const inProgress = repairs.filter(r => r.status === 'in_progress');
  const awaitingParts = repairs.filter(r => r.status === 'awaiting_parts');
  const allRepairs = repairs.length;

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  const sortedRepairs = [...repairs].sort((a, b) => {
    const dateA = new Date(a.date || a.startDate || 0);
    const dateB = new Date(b.date || b.startDate || 0);
    return dateB.getTime() - dateA.getTime();
  });

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
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm">
                <th className="py-2">Date</th>
                <th>Client</th>
                <th>Véhicule</th>
                <th>Description</th>
                <th>Mécanicien</th>
                <th>Statut</th>
                <th>Progression</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRepairs.map((repair) => (
                <tr key={repair.id} className="border-t">
                  <td className="py-3">{repair.date ? new Date(repair.date).toLocaleDateString('fr-FR') : 'N/A'}</td>
                  <td>{repair.clientName}</td>
                  <td>{repair.vehicleName}</td>
                  <td>{repair.description}</td>
                  <td>{repair.mechanicName}</td>
                  <td>{repair.status === 'in_progress' ? 'En cours' : repair.status}</td>
                  <td>{repair.progress}%</td>
                  <td>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
