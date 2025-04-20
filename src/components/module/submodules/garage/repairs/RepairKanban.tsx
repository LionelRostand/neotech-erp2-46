
import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { 
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Repair } from '../types/garage-types';
import { RepairColumn } from './RepairColumn';
import { RepairCard } from './RepairCard';

const COLUMNS = [
  { id: 'awaiting_approval', title: 'À approuver' },
  { id: 'in_progress', title: 'En cours' },
  { id: 'awaiting_parts', title: 'En attente de pièces' },
  { id: 'completed', title: 'Terminé' },
];

export const RepairKanban = () => {
  const { repairs, isLoading } = useGarageData();
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeRepair = repairs.find(item => item.id === active.id);
      if (activeRepair && over.id) {
        const newStatus = over.id as Repair['status'];
        // Here you would update the repair status in Firestore
        // This will trigger a real-time update through useGarageData
      }
    }
    setActiveId(null);
  };

  if (isLoading) {
    return <div className="text-center">Chargement du tableau...</div>;
  }

  return (
    <div className="mt-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map(column => (
            <RepairColumn
              key={column.id}
              id={column.id}
              title={column.title}
              items={repairs.filter(item => item.status === column.id)}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeId ? (
            <RepairCard 
              repair={repairs.find(item => item.id === activeId)!}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
