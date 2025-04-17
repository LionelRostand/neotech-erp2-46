
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownUp, Loader2 } from 'lucide-react';
import { RecruitmentPost } from '@/types/recruitment';
import KanbanCard from './KanbanCard';

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
    id: id,
  });

  return (
    <Card className="min-w-[300px] max-w-[300px] h-[calc(100vh-220px)]">
      <CardHeader className="py-2 px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            {title}
            <span className="ml-2 text-xs font-normal bg-gray-100 px-1.5 py-0.5 rounded-full">
              {items.length}
            </span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={onSort}
            disabled={isOrganizing}
          >
            {isOrganizing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowDownUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2 overflow-auto h-[calc(100%-60px)]">
        <div ref={setNodeRef} className="space-y-2 min-h-[100px]">
          {items.length === 0 ? (
            <div className="h-20 border border-dashed rounded-md flex items-center justify-center text-xs text-gray-400">
              Déposez les offres ici
            </div>
          ) : (
            items.map((item) => (
              <KanbanCard key={item.id} item={item} type="offer" />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
