
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { RecruitmentPost } from '@/types/recruitment';
import { Button } from '@/components/ui/button';
import { SortAsc, AlertCircle, Clock, User, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface KanbanColumnProps {
  id: string;
  title: string;
  items: RecruitmentPost[];
  onSort: () => void;
  isOrganizing: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  items,
  onSort,
  isOrganizing
}) => {
  const { setNodeRef } = useDroppable({
    id
  });

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'haute':
      case 'high':
      case 'urgente':
        return 'bg-red-100 text-red-800';
      case 'moyenne':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'basse':
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-72">
      <div className="bg-gray-50 rounded-lg shadow p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-md">{title} <span className="text-gray-500 text-sm">({items.length})</span></h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2" 
            onClick={onSort}
            disabled={isOrganizing}
          >
            <SortAsc className="h-4 w-4" />
            <span className="sr-only">Trier</span>
          </Button>
        </div>

        <div className="space-y-3 overflow-y-auto flex-grow">
          {isOrganizing ? (
            <>
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-24" />
            </>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="bg-white cursor-move">
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-sm font-medium">{item.position}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <User className="h-3 w-3 mr-1" />
                    <span>{item.department}</span>
                    <span className="mx-1">•</span>
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{item.candidates ? item.candidates.length : 0} candidats</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
