
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Repair } from '../types/garage-types';

interface RepairCardProps {
  repair: Repair;
}

export const RepairCard = ({ repair }: RepairCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: repair.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move hover:shadow-md transition-shadow"
    >
      <CardContent className="p-4 space-y-2">
        <div>
          <div className="font-medium">{repair.vehicleName}</div>
          <div className="text-sm text-gray-500">{repair.clientName}</div>
        </div>
        <div className="text-sm">{repair.description}</div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{repair.mechanicName}</span>
          <span>{new Date(repair.startDate).toLocaleDateString('fr-FR')}</span>
        </div>
      </CardContent>
    </Card>
  );
};
