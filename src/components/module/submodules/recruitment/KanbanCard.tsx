
import React from 'react';
import { Card } from '@/components/ui/card';
import { CandidateApplication } from '@/types/recruitment';
import { useDraggable } from '@dnd-kit/core';

interface KanbanCardProps {
  candidate: CandidateApplication;
}

const KanbanCard = ({ candidate }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: candidate.id,
    data: candidate,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card className="p-3 bg-white cursor-move hover:shadow-md transition-shadow">
        <p className="font-medium text-sm">{candidate.candidateName}</p>
        <p className="text-xs text-muted-foreground">{candidate.candidateEmail}</p>
      </Card>
    </div>
  );
};

export default KanbanCard;
