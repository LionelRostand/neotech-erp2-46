
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
  arrayMove
} from '@dnd-kit/sortable';
import { repairs } from './repairsData';
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
  const [items, setItems] = React.useState<Repair[]>(repairs);
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
      const activeRepair = items.find(item => item.id === active.id);
      if (activeRepair && over.id) {
        const newStatus = over.id as Repair['status'];
        setItems(items.map(item => 
          item.id === active.id 
            ? { ...item, status: newStatus }
            : item
        ));
      }
    }
    setActiveId(null);
  };

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
              items={items.filter(item => item.status === column.id)}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeId ? (
            <RepairCard 
              repair={items.find(item => item.id === activeId)!}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
