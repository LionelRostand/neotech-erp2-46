
import React from 'react';
import { RecruitmentPost } from '@/types/recruitment';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import KanbanItem from './KanbanItem';

interface KanbanColumnProps {
  id: string;
  title: string;
  items: RecruitmentPost[];
  isDragging?: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, items = [], isDragging }) => {
  // Make the column droppable
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });
  
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];
  
  return (
    <div 
      ref={setNodeRef}
      className={`flex-shrink-0 w-72 ${isOver && isDragging ? 'bg-blue-50 rounded-lg' : ''}`}
    >
      <div className="bg-muted/30 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{title}</h3>
          <Badge variant="outline" className="bg-white">
            {safeItems.length}
          </Badge>
        </div>
        
        <div className="space-y-3">
          {safeItems.length === 0 ? (
            <Card className="bg-white/50 border-dashed">
              <CardContent className="p-3 text-center text-sm text-muted-foreground">
                Aucun poste dans cette catégorie
              </CardContent>
            </Card>
          ) : (
            safeItems.map((item) => {
              if (!item) return null; // Safety check
              
              return (
                <KanbanItem key={item.id} item={item} />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
