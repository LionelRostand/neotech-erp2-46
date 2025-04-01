
import React from 'react';
import { cn } from '@/lib/utils';
import { useDrag } from 'react-dnd';

interface ElementItemProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
  type?: string;
  draggable?: boolean;
}

const ElementItem: React.FC<ElementItemProps> = ({
  icon,
  label,
  className,
  type = 'unknown',
  draggable = true
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ELEMENT',
    item: { type, label },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: draggable
  }));

  return (
    <div
      ref={drag}
      className={cn(
        'rounded cursor-pointer select-none',
        isDragging ? 'opacity-50' : 'opacity-100',
        draggable ? 'cursor-move' : 'cursor-default',
        className
      )}
    >
      <div className="flex flex-col items-center gap-1">
        <div className="text-muted-foreground">{icon}</div>
        <div className="text-xs">{label}</div>
      </div>
    </div>
  );
};

export default ElementItem;
