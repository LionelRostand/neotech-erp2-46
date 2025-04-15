
import React from 'react';
import { Card } from '@/components/ui/card';
import { CandidateApplication, RecruitmentPost } from '@/types/recruitment';
import { useDraggable } from '@dnd-kit/core';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface KanbanCardProps {
  item: CandidateApplication | RecruitmentPost;
  type: 'candidate' | 'offer';
}

const KanbanCard = ({ item, type }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: {
      item,
      type,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  // Render candidate card
  if (type === 'candidate') {
    const candidate = item as CandidateApplication;
    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <Card className="p-3 bg-white cursor-move hover:shadow-md transition-shadow">
          <p className="font-medium text-sm">{candidate.candidateName}</p>
          <p className="text-xs text-muted-foreground">{candidate.candidateEmail}</p>
          {candidate.resume && (
            <div className="mt-2 text-xs flex items-center text-blue-600">
              <FileText className="h-3 w-3 mr-1" />
              <span>CV joint</span>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Render offer card
  const post = item as RecruitmentPost;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card className="p-3 bg-white cursor-move hover:shadow-md transition-shadow">
        <p className="font-medium text-sm">{post.position}</p>
        <p className="text-xs text-muted-foreground">{post.department}</p>
        <div className="flex justify-between items-center mt-1">
          <Badge className={`text-xs ${
            post.status === 'Ouvert' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
            post.status === 'En cours' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
            'bg-gray-100 text-gray-800 hover:bg-gray-100'
          }`}>
            {post.status}
          </Badge>
          {post.candidates && post.candidates.length > 0 && (
            <span className="text-xs text-gray-500">
              {post.candidates.length} candidat{post.candidates.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default KanbanCard;
