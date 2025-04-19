
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Repair } from '../types/garage-types';
import { RepairCard } from './RepairCard';

interface RepairColumnProps {
  id: string;
  title: string;
  items: Repair[];
}

export const RepairColumn = ({ id, title, items }: RepairColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-4">{title} ({items.length})</h3>
      <div
        ref={setNodeRef}
        className="space-y-3 min-h-[200px]"
      >
        {items.map(repair => (
          <RepairCard key={repair.id} repair={repair} />
        ))}
      </div>
    </div>
  );
};
