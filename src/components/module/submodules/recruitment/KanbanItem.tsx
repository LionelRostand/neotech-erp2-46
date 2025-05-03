
import React from 'react';
import { RecruitmentPost } from '@/types/recruitment';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface KanbanItemProps {
  item: RecruitmentPost;
}

const KanbanItem: React.FC<KanbanItemProps> = ({ item }) => {
  // Make the item draggable
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
    cursor: 'grab'
  };
  
  // Get priority color
  const getPriorityColor = (priority: string = '') => {
    const p = priority?.toLowerCase();
    if (p === 'haute' || p === 'high') return 'bg-red-100 text-red-800 border-red-200';
    if (p === 'moyenne' || p === 'medium') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={`bg-white ${isDragging ? 'ring-2 ring-blue-500' : ''}`}>
        <CardContent className="p-3">
          <h4 className="font-medium text-sm">{item.position}</h4>
          
          <div className="mt-2 space-y-1 text-xs">
            {item.department && (
              <div className="flex items-center text-muted-foreground">
                <Building className="h-3 w-3 mr-1" />
                <span>{item.department}</span>
              </div>
            )}
            
            {item.location && (
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{item.location}</span>
              </div>
            )}
            
            {item.openDate && (
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Ouvert le {item.openDate}</span>
              </div>
            )}
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            {item.priority && (
              <Badge className={`${getPriorityColor(item.priority)} text-xs`}>
                {item.priority}
              </Badge>
            )}
            
            {item.candidates && (
              <Badge variant="outline" className="text-xs">
                {Array.isArray(item.candidates) ? item.candidates.length : 0} candidat(s)
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanItem;
