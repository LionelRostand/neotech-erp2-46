
import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Repair } from '../types/garage-types';
import RepairColumn from './RepairColumn';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ViewRepairDialog from './ViewRepairDialog';
import EditRepairDialog from './EditRepairDialog';
import DeleteRepairDialog from './DeleteRepairDialog';
import { Wrench, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export function RepairKanban() {
  const { repairs, isLoading, refetch } = useGarageData();
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const inProgress = repairs.filter(r => r.status === 'in_progress');
  const awaitingParts = repairs.filter(r => r.status === 'awaiting_parts');
  const completed = repairs.filter(r => r.status === 'completed');

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      // Handle sorting within the same column
      console.log('Drag ended', active, over);
      // Implementation for within column sorting would go here
    }
  };

  const handleStatusChange = async (repairId: string, newStatus: string) => {
    try {
      const repairRef = doc(db, COLLECTIONS.GARAGE.REPAIRS, repairId);
      await updateDoc(repairRef, { 
        status: newStatus,
        lastUpdated: new Date().toISOString()
      });
      
      // Update the local data via refetch
      if (typeof refetch === 'function') {
        refetch();
      }
      toast.success('Statut de réparation mis à jour');
    } catch (error) {
      console.error('Error updating repair status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleViewRepair = (repair: Repair) => {
    setSelectedRepair(repair);
    setViewDialogOpen(true);
  };

  const handleEditRepair = (repair: Repair) => {
    setSelectedRepair(repair);
    setEditDialogOpen(true);
  };

  const handleDeleteRepair = (repair: Repair) => {
    setSelectedRepair(repair);
    setDeleteDialogOpen(true);
  };

  const handleUpdate = () => {
    // Call refetch to update the data
    if (typeof refetch === 'function') {
      refetch();
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Gestion des réparations</h2>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <RepairColumn 
            title="En cours" 
            iconColor="text-blue-500" 
            icon={<Wrench className="h-4 w-4" />}
            repairs={inProgress} 
            onViewRepair={handleViewRepair}
            onEditRepair={handleEditRepair}
            onDeleteRepair={handleDeleteRepair}
            onStatusChange={handleStatusChange}
          />
          
          <RepairColumn 
            title="Attente pièces" 
            iconColor="text-amber-500" 
            icon={<Wrench className="h-4 w-4" />}
            repairs={awaitingParts}
            onViewRepair={handleViewRepair}
            onEditRepair={handleEditRepair}
            onDeleteRepair={handleDeleteRepair}
            onStatusChange={handleStatusChange}
          />
          
          <RepairColumn 
            title="Terminées" 
            iconColor="text-green-500" 
            icon={<Wrench className="h-4 w-4" />}
            repairs={completed}
            onViewRepair={handleViewRepair}
            onEditRepair={handleEditRepair}
            onDeleteRepair={handleDeleteRepair}
            onStatusChange={handleStatusChange}
          />
        </div>
      </DndContext>

      <ViewRepairDialog 
        repair={selectedRepair} 
        open={viewDialogOpen} 
        onOpenChange={setViewDialogOpen} 
      />
      
      <EditRepairDialog 
        repair={selectedRepair} 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        onUpdate={handleUpdate}
      />
      
      <DeleteRepairDialog 
        repairId={selectedRepair?.id ?? null} 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        onDelete={handleUpdate}
      />
    </div>
  );
}

export default RepairKanban;
