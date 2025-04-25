
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useGarageMechanics } from '@/hooks/garage/useGarageMechanics';
import MechanicsStats from './components/MechanicsStats';
import MechanicsTable from './components/MechanicsTable';
import ViewMechanicDialog from './components/ViewMechanicDialog';
import EditMechanicDialog from './components/EditMechanicDialog';
import DeleteMechanicDialog from './components/DeleteMechanicDialog';
import { AddMechanicDialog } from './components/AddMechanicDialog';
import type { Mechanic } from '../types/garage-types';

const GarageMechanicsDashboard = () => {
  const { mechanics = [], isLoading, updateMechanic, deleteMechanic } = useGarageMechanics();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const availableMechanics = mechanics.filter(m => m.status === 'available');
  const busyMechanics = mechanics.filter(m => m.status === 'in_service');
  const onBreakMechanics = mechanics.filter(m => m.status === 'on_break');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mécaniciens</h1>
        <Button onClick={() => setOpenAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau mécanicien
        </Button>
      </div>

      <MechanicsStats
        availableCount={availableMechanics.length}
        busyCount={busyMechanics.length}
        onBreakCount={onBreakMechanics.length}
        totalCount={mechanics.length}
      />

      <Card className="p-6">
        <h2 className="font-medium mb-4">Liste des mécaniciens</h2>
        <MechanicsTable
          mechanics={mechanics}
          onView={(mechanic) => {
            setSelectedMechanic(mechanic);
            setIsViewOpen(true);
          }}
          onEdit={(mechanic) => {
            setSelectedMechanic(mechanic);
            setIsEditOpen(true);
          }}
          onDelete={(mechanic) => {
            setSelectedMechanic(mechanic);
            setIsDeleteOpen(true);
          }}
        />
      </Card>

      <AddMechanicDialog 
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
      />

      <ViewMechanicDialog
        mechanic={selectedMechanic}
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedMechanic(null);
        }}
      />

      <EditMechanicDialog
        mechanic={selectedMechanic}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedMechanic(null);
        }}
        onUpdate={updateMechanic}
      />

      <DeleteMechanicDialog
        mechanic={selectedMechanic}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedMechanic(null);
        }}
        onDelete={deleteMechanic}
      />
    </div>
  );
};

export default GarageMechanicsDashboard;
