
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ElementItemProps {
  icon: ReactNode;
  label: string;
  className?: string;
}

const ElementItem: React.FC<ElementItemProps> = ({ icon, label, className }) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 p-2 rounded-md border border-border bg-card hover:bg-accent cursor-move transition-colors",
        className
      )}
      draggable
    >
      <div className="text-muted-foreground">
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </div>
  );
};

export default ElementItem;
