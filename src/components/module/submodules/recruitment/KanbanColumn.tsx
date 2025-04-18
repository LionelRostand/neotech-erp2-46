
import React from 'react';
import { useDroppable } from "@dnd-kit/core";
import { RecruitmentPost } from '@/types/recruitment';
import KanbanCard from './KanbanCard';
import AddCandidateDialog from './AddCandidateDialog';

interface KanbanColumnProps {
  id: string;
  title: string;
  items: RecruitmentPost[];
  onSort?: () => void;
  isOrganizing?: boolean;
  currentlyDraggingId?: string | null;
}

export default function KanbanColumn({ id, title, items, onSort, isOrganizing, currentlyDraggingId }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col min-w-[300px] max-w-[350px] bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{title}</h3>
          <span className="bg-gray-200 px-2 py-1 rounded text-sm">
            {items.length}
          </span>
        </div>
        {id === 'En cours' && items.length > 0 && (
          <AddCandidateDialog 
            recruitmentId={items[0].id} 
            onCandidateAdded={(candidate) => {
              if (!items[0].candidates) {
                items[0].candidates = [];
              }
              items[0].candidates.push(candidate);
            }}
          />
        )}
      </div>
      
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-[200px] ${
          currentlyDraggingId ? 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-md p-2' : ''
        }`}
      >
        {items.map((item) => (
          <KanbanCard 
            key={item.id} 
            item={item} 
            type="recruitment" 
            isDragging={item.id === currentlyDraggingId}
          />
        ))}
      </div>
    </div>
  );
}
